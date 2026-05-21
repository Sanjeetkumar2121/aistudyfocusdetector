import asyncio
import cv2
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
            self.camera = cv2.VideoCapture(0)
            
            if not self.camera.isOpened():
                logger.error("Failed to open camera")
                self.is_running = False
                raise RuntimeError("Camera not accessible")
            
            # Set camera properties
            self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.camera.set(cv2.CAP_PROP_FPS, settings.TARGET_FPS)
            
            logger.info("Focus service started")
            
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
            
            if self.camera:
                self.camera.release()
            
            self.vision_processor.release()
            
            logger.info("Focus service stopped")
        except Exception as e:
            logger.error(f"Error stopping focus service: {e}")
    
    async def _process_loop(self):
        """Main processing loop for vision and focus analysis"""
        while self.is_running:
            try:
                if not self.camera or not self.camera.isOpened():
                    await asyncio.sleep(0.1)
                    continue
                
                ret, frame = self.camera.read()
                
                if not ret:
                    self.skipped_frames += 1
                    logger.warning(f"Failed to read frame. Skipped: {self.skipped_frames}")
                    await asyncio.sleep(0.01)
                    continue
                
                self.frame_count += 1
                
                # Process frame
                vision_metrics = self.vision_processor.process_frame(frame)
                
                # Calculate focus metrics
                focus_metrics = self.focus_calculator.calculate_focus_metrics(vision_metrics)
                
                # Create metric record
                metric_record = {
                    "timestamp": datetime.utcnow().isoformat(),
                    "focus_score": focus_metrics.get("focus_score", 0),
                    "attention": focus_metrics.get("attention", 0),
                    "drowsiness": focus_metrics.get("drowsiness", 0),
                    "blink_rate": focus_metrics.get("blink_rate", 0),
                    "eye_openness": focus_metrics.get("eye_openness", 0),
                    "head_position": focus_metrics.get("head_position", {"x": 0.5, "y": 0.5}),
                    "head_rotation": focus_metrics.get("head_rotation", {"pitch": 0, "yaw": 0, "roll": 0}),
                    "posture_score": focus_metrics.get("posture_score", 0),
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
