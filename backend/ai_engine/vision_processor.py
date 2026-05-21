import cv2
import mediapipe as mp
import numpy as np
import logging
from typing import Tuple, Optional, Dict

logger = logging.getLogger(__name__)

class VisionProcessor:
    """Process video frames and extract facial features using MediaPipe"""
    
    def __init__(self):
        # Initialize MediaPipe
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_pose = mp.solutions.pose
        self.mp_holistic = mp.solutions.holistic
        
        # Create detectors
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7,
        )
        
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7,
        )
        
        # Eye landmarks indices from face_mesh
        self.LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380]
        
        # State tracking
        self.prev_blink_state = False
        self.blink_count = 0
        self.frame_count = 0
        
    def process_frame(self, frame: np.ndarray) -> Dict:
        """
        Process a frame and extract focus-related metrics
        
        Returns:
            Dictionary with extracted metrics
        """
        try:
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            h, w, _ = frame.shape
            
            # Process face mesh
            face_results = self.face_mesh.process(rgb_frame)
            
            # Process pose
            pose_results = self.pose.process(rgb_frame)
            
            metrics = {
                "eye_openness": 100.0,
                "blink_detected": False,
                "head_position": {"x": 0.5, "y": 0.5},
                "head_rotation": {"pitch": 0, "yaw": 0, "roll": 0},
                "posture_score": 100.0,
                "face_detected": False,
                "pose_detected": False,
            }
            
            # Extract face metrics
            if face_results.multi_face_landmarks:
                metrics["face_detected"] = True
                face_landmarks = face_results.multi_face_landmarks[0]
                
                # Get eye openness
                eye_openness = self._calculate_eye_openness(face_landmarks, h, w)
                metrics["eye_openness"] = eye_openness
                
                # Detect blink
                is_blinking = eye_openness < 0.2
                metrics["blink_detected"] = is_blinking
                
                # Count blinks
                if is_blinking and not self.prev_blink_state:
                    self.blink_count += 1
                self.prev_blink_state = is_blinking
                
                # Get head position
                head_pos = self._get_head_position(face_landmarks)
                metrics["head_position"] = head_pos
                
                # Get head rotation
                head_rotation = self._get_head_rotation(face_landmarks, h, w)
                metrics["head_rotation"] = head_rotation
            
            # Extract pose metrics
            if pose_results.pose_landmarks:
                metrics["pose_detected"] = True
                
                # Calculate posture score
                posture_score = self._calculate_posture_score(pose_results.pose_landmarks)
                metrics["posture_score"] = posture_score
            
            # Calculate blink rate (blinks per minute)
            self.frame_count += 1
            if self.frame_count % 30 == 0:  # Every 30 frames
                metrics["blink_rate"] = (self.blink_count / 30) * 60  # scale to per minute
                self.blink_count = 0
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            return self._get_empty_metrics()
    
    def _calculate_eye_openness(self, landmarks, height: int, width: int) -> float:
        """Calculate eye openness percentage (0-100)"""
        try:
            # Left eye
            left_eye_top = landmarks[159].y
            left_eye_bottom = landmarks[145].y
            left_eye_height = abs(left_eye_bottom - left_eye_top)
            
            # Right eye
            right_eye_top = landmarks[386].y
            right_eye_bottom = landmarks[374].y
            right_eye_height = abs(right_eye_bottom - right_eye_top)
            
            # Average and normalize
            avg_height = (left_eye_height + right_eye_height) / 2
            # Normal eye opening is around 0.05 in normalized coordinates
            eye_openness = (avg_height / 0.05) * 100
            eye_openness = min(100, max(0, eye_openness))
            
            return eye_openness
        except:
            return 100.0
    
    def _get_head_position(self, landmarks) -> Dict[str, float]:
        """Get normalized head center position"""
        try:
            # Use face center landmarks
            nose = landmarks[1]  # Nose tip
            return {
                "x": float(nose.x),
                "y": float(nose.y),
            }
        except:
            return {"x": 0.5, "y": 0.5}
    
    def _get_head_rotation(self, landmarks, height: int, width: int) -> Dict[str, float]:
        """Estimate head rotation (pitch, yaw, roll)"""
        try:
            # Get key points
            left_eye = landmarks[33]
            right_eye = landmarks[263]
            nose = landmarks[1]
            left_mouth = landmarks[61]
            right_mouth = landmarks[291]
            
            # Simple yaw estimation (left-right)
            eye_center_x = (left_eye.x + right_eye.x) / 2
            nose_to_eye_offset = nose.x - eye_center_x
            yaw = nose_to_eye_offset * 90  # Scale to degrees
            
            # Simple pitch estimation (up-down)
            eye_center_y = (left_eye.y + right_eye.y) / 2
            nose_to_eye_offset_y = nose.y - eye_center_y
            pitch = nose_to_eye_offset_y * 90
            
            # Simple roll estimation (tilt)
            eye_y_diff = left_eye.y - right_eye.y
            roll = eye_y_diff * 90
            
            return {
                "pitch": float(pitch),
                "yaw": float(yaw),
                "roll": float(roll),
            }
        except:
            return {"pitch": 0, "yaw": 0, "roll": 0}
    
    def _calculate_posture_score(self, landmarks) -> float:
        """Calculate posture score based on body position"""
        try:
            # Get shoulder landmarks
            left_shoulder = landmarks[11]
            right_shoulder = landmarks[12]
            
            # Get hip landmarks
            left_hip = landmarks[23]
            right_hip = landmarks[24]
            
            # Get nose
            nose = landmarks[0]
            
            # Check if spine is straight (shoulders and hips aligned vertically)
            shoulder_center_x = (left_shoulder.x + right_shoulder.x) / 2
            hip_center_x = (left_hip.x + right_hip.x) / 2
            
            # Horizontal alignment
            alignment_error = abs(shoulder_center_x - hip_center_x)
            alignment_score = max(0, 100 * (1 - alignment_error * 2))
            
            # Check for slouching (forward head posture)
            shoulder_center_y = (left_shoulder.y + right_shoulder.y) / 2
            forward_offset = nose.x - shoulder_center_x
            slouch_score = max(0, 100 * (1 - abs(forward_offset) * 2))
            
            posture_score = (alignment_score + slouch_score) / 2
            return min(100, max(0, posture_score))
        except:
            return 100.0
    
    def _get_empty_metrics(self) -> Dict:
        """Return default metrics when detection fails"""
        return {
            "eye_openness": 100.0,
            "blink_detected": False,
            "head_position": {"x": 0.5, "y": 0.5},
            "head_rotation": {"pitch": 0, "yaw": 0, "roll": 0},
            "posture_score": 100.0,
            "face_detected": False,
            "pose_detected": False,
            "blink_rate": 0.0,
        }
    
    def release(self):
        """Release resources"""
        self.face_mesh.close()
        self.pose.close()
