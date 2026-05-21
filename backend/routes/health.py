import logging
from fastapi import APIRouter
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
    return {
        "status": "available",
        "message": "Camera check endpoint ready (add camera hardware for actual detection)",
    }
