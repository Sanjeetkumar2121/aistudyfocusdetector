from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# Session Schemas
class SessionCreate(BaseModel):
    user_id: str = "default_user"

class SessionResponse(BaseModel):
    id: int
    user_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: int
    focus_score_avg: float
    attention_percentage: float
    
    class Config:
        from_attributes = True

class SessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    focus_score_avg: Optional[float] = None
    attention_percentage: Optional[float] = None

# Focus Metric Schemas
class FocusMetricCreate(BaseModel):
    focus_score: float = Field(ge=0, le=100)
    attention: float = Field(ge=0, le=100)
    drowsiness: float = Field(ge=0, le=100)
    blink_rate: float = Field(ge=0)
    eye_openness: float = Field(ge=0, le=100)
    head_position_x: float
    head_position_y: float
    head_rotation: float
    posture_score: float = Field(ge=0, le=100)
    slouching: bool = False

class FocusMetricResponse(BaseModel):
    id: int
    session_id: int
    timestamp: datetime
    focus_score: float
    attention: float
    drowsiness: float
    blink_rate: float
    eye_openness: float
    head_position_x: float
    head_position_y: float
    head_rotation: float
    posture_score: float
    slouching: bool
    
    class Config:
        from_attributes = True

# Daily Report Schemas
class DailyReportResponse(BaseModel):
    id: int
    user_id: str
    date: str
    total_study_time: int
    avg_focus_score: float
    avg_attention: float
    sessions_count: int
    total_breaks: int
    total_distractions: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Alert Schemas
class AlertCreate(BaseModel):
    alert_type: str  # drowsiness, posture, distraction, break
    severity: str = "info"
    message: str

class AlertResponse(BaseModel):
    id: int
    session_id: int
    alert_type: str
    severity: str
    message: str
    timestamp: datetime
    is_read: bool
    
    class Config:
        from_attributes = True

# Monitoring Status
class MonitoringStatus(BaseModel):
    is_active: bool
    current_session_id: Optional[int] = None
    focus_score: float = 0.0
    attention: float = 0.0
    drowsiness: float = 0.0
    message: str

# WebSocket Message
class WSMetric(BaseModel):
    focus_score: float
    attention: float
    drowsiness: float
    blink_rate: float
    eye_openness: float
    head_position_x: float
    head_position_y: float
    head_rotation: float
    posture_score: float
    slouching: bool
    timestamp: str
