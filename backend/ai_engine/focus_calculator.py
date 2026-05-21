import logging
from typing import Dict, Tuple
from config import settings
from collections import deque

logger = logging.getLogger(__name__)

class FocusCalculator:
    """Calculate focus score and related metrics based on vision data"""
    
    def __init__(self):
        # Thresholds from config
        self.blink_rate_min = settings.BLINK_RATE_NORMAL_MIN
        self.blink_rate_max = settings.BLINK_RATE_NORMAL_MAX
        
        # Weight configuration
        self.eye_weight = settings.EYE_METRICS_WEIGHT
        self.head_weight = settings.HEAD_MOVEMENT_WEIGHT
        self.posture_weight = settings.POSTURE_WEIGHT
        self.drowsiness_weight = settings.DROWSINESS_WEIGHT
        
        # State tracking
        self.head_position_history = deque(maxlen=30)  # Last 30 frames
        self.eye_openness_history = deque(maxlen=30)
        
    def calculate_focus_metrics(self, vision_metrics: Dict) -> Dict:
        """
        Calculate comprehensive focus metrics from vision data
        
        Args:
            vision_metrics: Dictionary from VisionProcessor
            
        Returns:
            Dictionary with focus_score, attention, drowsiness, etc.
        """
        try:
            # Extract individual scores
            eye_score = self._calculate_eye_score(vision_metrics)
            head_score = self._calculate_head_score(vision_metrics)
            posture_score = self._calculate_posture_score(vision_metrics)
            drowsiness_score = self._calculate_drowsiness_score(vision_metrics)
            
            # Calculate weighted focus score
            focus_score = (
                eye_score * self.eye_weight +
                head_score * self.head_weight +
                posture_score * self.posture_weight +
                drowsiness_score * self.drowsiness_weight
            )
            
            # Determine attention (focused vs not focused)
            attention = 100.0 if focus_score >= settings.FOCUS_THRESHOLD else 0.0
            
            # Normalize drowsiness to 0-100
            normalized_drowsiness = max(0, min(100, (100 - eye_score) * 0.5 + drowsiness_score * 0.5))
            
            return {
                "focus_score": max(0, min(100, focus_score)),
                "attention": attention,
                "drowsiness": normalized_drowsiness,
                "eye_score": eye_score,
                "head_score": head_score,
                "posture_score": vision_metrics.get("posture_score", 100.0),
                "drowsiness_score": drowsiness_score,
                "blink_rate": vision_metrics.get("blink_rate", 0.0),
                "eye_openness": vision_metrics.get("eye_openness", 100.0),
                "head_position": vision_metrics.get("head_position", {"x": 0.5, "y": 0.5}),
                "head_rotation": vision_metrics.get("head_rotation", {"pitch": 0, "yaw": 0, "roll": 0}),
                "slouching": vision_metrics.get("posture_score", 100.0) < 70,
            }
        except Exception as e:
            logger.error(f"Error calculating focus metrics: {e}")
            return self._get_empty_metrics()
    
    def _calculate_eye_score(self, vision_metrics: Dict) -> float:
        """
        Calculate eye-based focus score (40% weight)
        Based on: blink rate, eye openness
        """
        try:
            eye_openness = vision_metrics.get("eye_openness", 100.0)
            blink_rate = vision_metrics.get("blink_rate", 0.0)
            
            # Openness score: penalize if eyes are closing
            openness_score = eye_openness  # 0-100
            
            # Blink rate score: normal is 12-25 blinks/min
            # Too high (>25) or too low (<12) indicates distraction/drowsiness
            if blink_rate < self.blink_rate_min:
                # Low blink rate - might be drowsy
                blink_score = (blink_rate / self.blink_rate_min) * 80
            elif blink_rate <= self.blink_rate_max:
                # Normal blink rate
                blink_score = 100.0
            else:
                # High blink rate - might be stressed or distracted
                blink_score = max(0, 100 - (blink_rate - self.blink_rate_max) * 2)
            
            # Combine openness and blink rate
            eye_score = (openness_score * 0.6 + blink_score * 0.4)
            
            self.eye_openness_history.append(eye_openness)
            
            return max(0, min(100, eye_score))
        except:
            return 50.0
    
    def _calculate_head_score(self, vision_metrics: Dict) -> float:
        """
        Calculate head movement focus score (30% weight)
        Based on: head rotation stability, extreme angles
        """
        try:
            head_rotation = vision_metrics.get("head_rotation", {"pitch": 0, "yaw": 0, "roll": 0})
            head_position = vision_metrics.get("head_position", {"x": 0.5, "y": 0.5})
            
            pitch = abs(head_rotation.get("pitch", 0))
            yaw = abs(head_rotation.get("yaw", 0))
            roll = abs(head_rotation.get("roll", 0))
            
            # Check for extreme angles (looking away)
            looking_away_score = 100.0
            if yaw > 30:  # Severe looking to the side
                looking_away_score -= (yaw - 30) * 1.5
            if pitch > 40:  # Severe looking down/up
                looking_away_score -= (pitch - 40) * 1.5
            if roll > 20:  # Severe head tilt
                looking_away_score -= (roll - 20) * 1.5
            
            looking_away_score = max(0, min(100, looking_away_score))
            
            # Track head position stability
            self.head_position_history.append(head_position)
            
            # Calculate movement stability
            stability_score = 100.0
            if len(self.head_position_history) > 10:
                # Calculate variance in head position
                positions = list(self.head_position_history)
                x_values = [p["x"] for p in positions]
                y_values = [p["y"] for p in positions]
                
                x_variance = sum((x - sum(x_values)/len(x_values))**2 for x in x_values) / len(x_values)
                y_variance = sum((y - sum(y_values)/len(y_values))**2 for y in y_values) / len(y_values)
                
                # High variance means unstable/distracted
                avg_variance = (x_variance + y_variance) / 2
                stability_score = max(0, 100 - avg_variance * 1000)
            
            head_score = (looking_away_score * 0.6 + stability_score * 0.4)
            return max(0, min(100, head_score))
        except:
            return 50.0
    
    def _calculate_posture_score(self, vision_metrics: Dict) -> float:
        """
        Calculate posture focus score (20% weight)
        Based on: body alignment, slouching
        """
        try:
            posture_score = vision_metrics.get("posture_score", 100.0)
            
            # Penalize slouching significantly
            if posture_score < 70:
                # Reduce score more for poor posture
                adjusted_score = posture_score * 0.8
            else:
                adjusted_score = posture_score
            
            return max(0, min(100, adjusted_score))
        except:
            return 50.0
    
    def _calculate_drowsiness_score(self, vision_metrics: Dict) -> float:
        """
        Calculate drowsiness level (10% weight, inverse relationship)
        Based on: eye openness, blink patterns
        """
        try:
            eye_openness = vision_metrics.get("eye_openness", 100.0)
            blink_rate = vision_metrics.get("blink_rate", 0.0)
            
            # High eye closure = high drowsiness
            drowsiness_from_openness = (100 - eye_openness) * 0.7
            
            # Very low blink rate = high drowsiness (eyes barely moving)
            drowsiness_from_blink = 0.0
            if blink_rate < 5:
                drowsiness_from_blink = (5 - blink_rate) * 15
            
            drowsiness_score = min(100, drowsiness_from_openness + drowsiness_from_blink)
            
            # Return as a score (inverted from actual drowsiness)
            # Score of 0 = completely drowsy, 100 = alert
            return max(0, 100 - drowsiness_score)
        except:
            return 50.0
    
    def _get_empty_metrics(self) -> Dict:
        """Return default metrics on error"""
        return {
            "focus_score": 0.0,
            "attention": 0.0,
            "drowsiness": 50.0,
            "eye_score": 0.0,
            "head_score": 0.0,
            "posture_score": 0.0,
            "drowsiness_score": 50.0,
            "blink_rate": 0.0,
            "eye_openness": 0.0,
            "head_position": {"x": 0.5, "y": 0.5},
            "head_rotation": {"pitch": 0, "yaw": 0, "roll": 0},
            "slouching": False,
        }
