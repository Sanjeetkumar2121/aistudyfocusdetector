import logging
import cv2
from fastapi import APIRouter, HTTPException
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def health_check():
    """Check backend health status"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "AI Study Focus Detector Backend",
        "version": "1.0.0",
    }

@router.get("/camera")
async def camera_check():
    """Check if camera is available"""
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise HTTPException(status_code=503, detail="Camera not available")
        
        ret, _ = cap.read()
        cap.release()
        
        if not ret:
            raise HTTPException(status_code=503, detail="Camera not responding")
        
        return {
            "status": "available",
            "message": "Camera is accessible and functioning",
        }
    except Exception as e:
        logger.error(f"Camera check failed: {e}")
        raise HTTPException(status_code=503, detail=f"Camera error: {str(e)}")
