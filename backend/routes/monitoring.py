import logging
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict
from database.database import get_db
from database.models import Session as SessionModel, FocusMetric, Alert
from database.schemas import SessionCreate, SessionResponse, MonitoringStatus
from services.focus_service import FocusService
import json

logger = logging.getLogger(__name__)

router = APIRouter()

# Global session tracker
active_sessions: Dict[int, FocusService] = {}

@router.post("/start")
async def start_monitoring(session_create: SessionCreate, db: Session = Depends(get_db)):
    """Start a new monitoring session"""
    try:
        # Create session record
        session = SessionModel(
            user_id=session_create.user_id,
            start_time=datetime.utcnow(),
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        # Initialize focus service for this session
        focus_service = FocusService()
        active_sessions[session.id] = focus_service
        
        logger.info(f"Started monitoring session {session.id} for user {session.user_id}")
        
        return {
            "session_id": session.id,
            "user_id": session.user_id,
            "start_time": session.start_time.isoformat(),
            "status": "monitoring_started",
        }
    except Exception as e:
        logger.error(f"Error starting monitoring: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop/{session_id}")
async def stop_monitoring(session_id: int, db: Session = Depends(get_db)):
    """Stop monitoring session"""
    try:
        # Get session
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Stop focus service
        if session_id in active_sessions:
            focus_service = active_sessions[session_id]
            await focus_service.stop()
            del active_sessions[session_id]
        
        # Update session
        session.end_time = datetime.utcnow()
        session.duration = int((session.end_time - session.start_time).total_seconds())
        
        # Calculate averages
        metrics = db.query(FocusMetric).filter(FocusMetric.session_id == session_id).all()
        if metrics:
            avg_focus = sum(m.focus_score for m in metrics) / len(metrics)
            avg_attention = sum(m.attention for m in metrics) / len(metrics)
            session.focus_score_avg = avg_focus
            session.attention_percentage = avg_attention
        
        db.commit()
        db.refresh(session)
        
        logger.info(f"Stopped monitoring session {session_id}")
        
        return {
            "session_id": session.id,
            "end_time": session.end_time.isoformat(),
            "duration": session.duration,
            "focus_score_avg": session.focus_score_avg,
            "attention_percentage": session.attention_percentage,
            "status": "monitoring_stopped",
        }
    except Exception as e:
        logger.error(f"Error stopping monitoring: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_status(db: Session = Depends(get_db)):
    """Get current monitoring status"""
    try:
        if not active_sessions:
            return MonitoringStatus(
                is_active=False,
                current_session_id=None,
                focus_score=0.0,
                attention=0.0,
                drowsiness=0.0,
                message="No active sessions",
            )
        
        # Get the first active session
        session_id = list(active_sessions.keys())[0]
        focus_service = active_sessions[session_id]
        
        latest_metrics = focus_service.get_latest_metrics()
        
        return MonitoringStatus(
            is_active=True,
            current_session_id=session_id,
            focus_score=latest_metrics.get("focus_score", 0.0),
            attention=latest_metrics.get("attention", 0.0),
            drowsiness=latest_metrics.get("drowsiness", 0.0),
            message="Monitoring active",
        )
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/stream/{session_id}")
async def websocket_stream(websocket: WebSocket, session_id: int, db: Session = Depends(get_db)):
    """WebSocket stream for real-time metrics"""
    await websocket.accept()
    
    try:
        # Verify session exists
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session:
            await websocket.close(code=4004, reason="Session not found")
            return
        
        logger.info(f"WebSocket client connected to session {session_id}")
        
        # Send metrics stream
        while True:
            if session_id in active_sessions:
                focus_service = active_sessions[session_id]
                metrics = focus_service.get_latest_metrics()
                
                if metrics:
                    message = {
                        "type": "metrics",
                        "data": {
                            "focus_score": metrics.get("focus_score"),
                            "attention": metrics.get("attention"),
                            "drowsiness": metrics.get("drowsiness"),
                            "blink_rate": metrics.get("blink_rate"),
                            "eye_openness": metrics.get("eye_openness"),
                            "head_position_x": metrics.get("head_position", {}).get("x"),
                            "head_position_y": metrics.get("head_position", {}).get("y"),
                            "head_rotation": metrics.get("head_rotation"),
                            "posture_score": metrics.get("posture_score"),
                            "slouching": metrics.get("slouching"),
                            "timestamp": metrics.get("timestamp"),
                        }
                    }
                    await websocket.send_json(message)
            
            # Small delay to prevent excessive messages
            import asyncio
            await asyncio.sleep(0.5)
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected from session {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.close(code=1011, reason="Server error")
        except:
            pass
