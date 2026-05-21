import asyncio
import logging
from typing import Dict, Optional
from datetime import datetime
from ai_engine.vision_processor import VisionProcessor
from ai_engine.focus_calculator import FocusCalculator
from config import settings
from collections import deque

logger = logging.getLogger(__name__)

class FocusService:
    """Service for real-time focus monitoring and analysis"""
    
    def __init__(self):
        self.vision_processor = VisionProcessor()
        self.focus_calculator = FocusCalculator()
        
        self.is_running = False
        self.camera = None
        self.metrics_history = deque(maxlen=100)
        self.latest_metrics: Optional[Dict] = None
        
        self.frame_count = 0
        self.skipped_frames = 0
        
    async def start(self):
        """Start monitoring session"""
        try:
            self.is_running = True
            
            logger.info("Focus service started (mock mode - no camera hardware)")
            
            # Start processing loop
            asyncio.create_task(self._process_loop())
            
        except Exception as e:
            logger.error(f"Error starting focus service: {e}")
            self.is_running = False
            raise
    
    async def stop(self):
        """Stop monitoring session"""
        try:
            self.is_running = False
            logger.info("Focus service stopped")
        except Exception as e:
            logger.error(f"Error stopping focus service: {e}")
    
    async def _process_loop(self):
        """Main processing loop for vision and focus analysis"""
        import random
        
        while self.is_running:
            try:
                self.frame_count += 1
                
                # Generate mock vision metrics
                vision_metrics = {
                    "eye_openness": random.uniform(0.7, 1.0),
                    "blink_rate": random.uniform(12, 18),
                    "head_pitch": random.uniform(-10, 10),
                    "head_yaw": random.uniform(-15, 15),
                    "head_roll": random.uniform(-5, 5),
                    "head_vertical": random.uniform(0.3, 0.7),
                    "head_horizontal": random.uniform(0.3, 0.7),
                }
                
                # Calculate focus metrics
                focus_metrics = self.focus_calculator.calculate_focus_metrics(vision_metrics)
                
                # Create metric record
                metric_record = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "focus_score": focus_metrics.get("focus_score", 70),
                    "attention": focus_metrics.get("attention", 75),
                    "drowsiness": focus_metrics.get("drowsiness", 10),
                    "blink_rate": focus_metrics.get("blink_rate", 15),
                    "eye_openness": focus_metrics.get("eye_openness", 0.85),
                    "head_position": focus_metrics.get("head_position", {"x": 0.5, "y": 0.5}),
                    "head_rotation": focus_metrics.get("head_rotation", {"pitch": 0, "yaw": 0, "roll": 0}),
                    "posture_score": focus_metrics.get("posture_score", 80),
                    "slouching": focus_metrics.get("slouching", False),
                }
                
                # Store metrics
                self.metrics_history.append(metric_record)
                self.latest_metrics = metric_record
                
                # Control frame rate
                await asyncio.sleep(1.0 / settings.TARGET_FPS)
                
            except Exception as e:
                logger.error(f"Error in processing loop: {e}")
                await asyncio.sleep(0.1)
    
    def get_latest_metrics(self) -> Optional[Dict]:
        """Get the latest metrics"""
        return self.latest_metrics
    
    def get_metrics_history(self, count: int = 10) -> list:
        """Get recent metrics history"""
        if not self.metrics_history:
            return []
        
        count = min(count, len(self.metrics_history))
        return list(self.metrics_history)[-count:]
    
    def get_stats(self) -> Dict:
        """Get processing statistics"""
        return {
            "is_running": self.is_running,
            "frames_processed": self.frame_count,
            "frames_skipped": self.skipped_frames,
            "metrics_stored": len(self.metrics_history),
            "latest_metrics": self.latest_metrics,
        }
