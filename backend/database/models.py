from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Session(Base):
    """Study session record"""
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), default="default_user")
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration = Column(Integer, default=0)  # in seconds
    focus_score_avg = Column(Float, default=0.0)
    attention_percentage = Column(Float, default=0.0)
    
    # Relationships
    metrics = relationship("FocusMetric", back_populates="session", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="session", cascade="all, delete-orphan")

class FocusMetric(Base):
    """Real-time focus metrics (1-second intervals)"""
    __tablename__ = "focus_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Core metrics
    focus_score = Column(Float, default=0.0)  # 0-100
    attention = Column(Float, default=0.0)  # 0-100
    drowsiness = Column(Float, default=0.0)  # 0-100
    
    # Eye metrics
    blink_rate = Column(Float, default=0.0)  # blinks per minute
    eye_openness = Column(Float, default=100.0)  # 0-100
    
    # Head metrics
    head_position_x = Column(Float, default=0.0)  # normalized
    head_position_y = Column(Float, default=0.0)  # normalized
    head_rotation = Column(Float, default=0.0)  # degrees
    
    # Posture metrics
    posture_score = Column(Float, default=100.0)  # 0-100
    slouching = Column(Boolean, default=False)
    
    # Relationships
    session = relationship("Session", back_populates="metrics")

class DailyReport(Base):
    """Aggregated daily statistics"""
    __tablename__ = "daily_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), index=True, default="default_user")
    date = Column(String(10), index=True)  # YYYY-MM-DD
    
    total_study_time = Column(Integer, default=0)  # in seconds
    avg_focus_score = Column(Float, default=0.0)
    avg_attention = Column(Float, default=0.0)
    sessions_count = Column(Integer, default=0)
    
    total_breaks = Column(Integer, default=0)
    total_distractions = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Alert(Base):
    """System alerts and notifications"""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), index=True)
    
    alert_type = Column(String(50), index=True)  # drowsiness, posture, distraction, break
    severity = Column(String(20), default="info")  # info, warning, critical
    message = Column(Text)
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    is_read = Column(Boolean, default=False)
    
    # Relationships
    session = relationship("Session", back_populates="alerts")
