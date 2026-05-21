import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings and configuration"""
    
    # API Configuration
    API_TITLE = "AI Study Focus Detector Backend"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "Real-time focus detection and analytics API"
    
    # Server
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./focus_detector.db")
    
    # Vision & AI
    TARGET_FPS = int(os.getenv("TARGET_FPS", 30))
    FRAME_BUFFER_SIZE = int(os.getenv("FRAME_BUFFER_SIZE", 5))
    
    # Focus Score Weights
    EYE_METRICS_WEIGHT = 0.40
    HEAD_MOVEMENT_WEIGHT = 0.30
    POSTURE_WEIGHT = 0.20
    DROWSINESS_WEIGHT = 0.10
    
    # Thresholds
    BLINK_RATE_NORMAL_MIN = 12  # blinks per minute
    BLINK_RATE_NORMAL_MAX = 25  # blinks per minute
    FOCUS_THRESHOLD = 60  # focus_score > 60 is considered focused
    DROWSINESS_THRESHOLD = 70  # Drowsiness level > 70
    
    # Alert Thresholds
    DROWSINESS_ALERT_DURATION = 3  # seconds
    POSTURE_ALERT_DURATION = 5  # seconds
    DISTRACTION_ALERT_COUNT = 3  # head turns in 10 seconds
    BREAK_RECOMMENDATION_TIME = 50  # minutes
    
    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE = "logs/app.log"

settings = Settings()
