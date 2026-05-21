import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from database.database import get_db
from database.models import Session as SessionModel, FocusMetric, DailyReport, Alert

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/session/{session_id}")
async def get_session_analytics(session_id: int, db: Session = Depends(get_db)):
    """Get detailed analytics for a specific session"""
    try:
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get all metrics for this session
        metrics = db.query(FocusMetric).filter(FocusMetric.session_id == session_id).all()
        
        if not metrics:
            return {
                "session_id": session.id,
                "user_id": session.user_id,
                "start_time": session.start_time.isoformat(),
                "end_time": session.end_time.isoformat() if session.end_time else None,
                "duration": session.duration,
                "focus_score_avg": session.focus_score_avg,
                "attention_percentage": session.attention_percentage,
                "metrics_count": 0,
                "metrics": [],
            }
        
        # Convert metrics to dict
        metrics_data = [
            {
                "timestamp": m.timestamp.isoformat(),
                "focus_score": m.focus_score,
                "attention": m.attention,
                "drowsiness": m.drowsiness,
                "blink_rate": m.blink_rate,
                "eye_openness": m.eye_openness,
                "posture_score": m.posture_score,
            }
            for m in metrics
        ]
        
        return {
            "session_id": session.id,
            "user_id": session.user_id,
            "start_time": session.start_time.isoformat(),
            "end_time": session.end_time.isoformat() if session.end_time else None,
            "duration": session.duration,
            "focus_score_avg": session.focus_score_avg,
            "attention_percentage": session.attention_percentage,
            "metrics_count": len(metrics),
            "metrics": metrics_data,
        }
    except Exception as e:
        logger.error(f"Error getting session analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/daily-report")
async def get_daily_report(user_id: str = Query("default_user"), db: Session = Depends(get_db)):
    """Get today's analytics"""
    try:
        today = datetime.utcnow().date().isoformat()
        
        # Try to get existing daily report
        report = db.query(DailyReport).filter(
            DailyReport.user_id == user_id,
            DailyReport.date == today
        ).first()
        
        if report:
            return {
                "date": report.date,
                "user_id": report.user_id,
                "total_study_time": report.total_study_time,
                "avg_focus_score": report.avg_focus_score,
                "avg_attention": report.avg_attention,
                "sessions_count": report.sessions_count,
                "total_breaks": report.total_breaks,
                "total_distractions": report.total_distractions,
            }
        
        # Calculate from sessions
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        sessions = db.query(SessionModel).filter(
            SessionModel.user_id == user_id,
            SessionModel.start_time >= today_start,
            SessionModel.start_time < today_end,
        ).all()
        
        if not sessions:
            return {
                "date": today,
                "user_id": user_id,
                "total_study_time": 0,
                "avg_focus_score": 0.0,
                "avg_attention": 0.0,
                "sessions_count": 0,
                "total_breaks": 0,
                "total_distractions": 0,
            }
        
        total_time = sum(s.duration for s in sessions)
        avg_focus = sum(s.focus_score_avg for s in sessions) / len(sessions) if sessions else 0
        avg_attention = sum(s.attention_percentage for s in sessions) / len(sessions) if sessions else 0
        
        # Count alerts
        alerts = db.query(Alert).filter(
            Alert.session_id.in_([s.id for s in sessions]),
        ).all()
        
        total_breaks = sum(1 for a in alerts if a.alert_type == "break")
        total_distractions = sum(1 for a in alerts if a.alert_type == "distraction")
        
        return {
            "date": today,
            "user_id": user_id,
            "total_study_time": total_time,
            "avg_focus_score": round(avg_focus, 2),
            "avg_attention": round(avg_attention, 2),
            "sessions_count": len(sessions),
            "total_breaks": total_breaks,
            "total_distractions": total_distractions,
        }
    except Exception as e:
        logger.error(f"Error getting daily report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/weekly-report")
async def get_weekly_report(user_id: str = Query("default_user"), db: Session = Depends(get_db)):
    """Get last 7 days analytics"""
    try:
        today = datetime.utcnow()
        week_start = (today - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        
        sessions = db.query(SessionModel).filter(
            SessionModel.user_id == user_id,
            SessionModel.start_time >= week_start,
        ).all()
        
        if not sessions:
            return {
                "period": "last_7_days",
                "user_id": user_id,
                "total_study_time": 0,
                "avg_focus_score": 0.0,
                "avg_attention": 0.0,
                "sessions_count": 0,
                "daily_breakdown": [],
            }
        
        # Group by date
        daily_data = {}
        for session in sessions:
            date_key = session.start_time.date().isoformat()
            if date_key not in daily_data:
                daily_data[date_key] = {
                    "date": date_key,
                    "total_time": 0,
                    "avg_focus": 0.0,
                    "sessions": 0,
                }
            
            daily_data[date_key]["total_time"] += session.duration
            daily_data[date_key]["avg_focus"] += session.focus_score_avg
            daily_data[date_key]["sessions"] += 1
        
        # Finalize averages
        for date_key in daily_data:
            sessions_count = daily_data[date_key]["sessions"]
            daily_data[date_key]["avg_focus"] = daily_data[date_key]["avg_focus"] / sessions_count
        
        total_time = sum(s.duration for s in sessions)
        avg_focus = sum(s.focus_score_avg for s in sessions) / len(sessions)
        avg_attention = sum(s.attention_percentage for s in sessions) / len(sessions)
        
        return {
            "period": "last_7_days",
            "user_id": user_id,
            "total_study_time": total_time,
            "avg_focus_score": round(avg_focus, 2),
            "avg_attention": round(avg_attention, 2),
            "sessions_count": len(sessions),
            "daily_breakdown": list(daily_data.values()),
        }
    except Exception as e:
        logger.error(f"Error getting weekly report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
async def get_all_sessions(
    user_id: str = Query("default_user"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get all sessions with pagination"""
    try:
        sessions = db.query(SessionModel).filter(
            SessionModel.user_id == user_id
        ).order_by(SessionModel.start_time.desc()).offset(offset).limit(limit).all()
        
        total = db.query(func.count(SessionModel.id)).filter(
            SessionModel.user_id == user_id
        ).scalar()
        
        sessions_data = [
            {
                "id": s.id,
                "user_id": s.user_id,
                "start_time": s.start_time.isoformat(),
                "end_time": s.end_time.isoformat() if s.end_time else None,
                "duration": s.duration,
                "focus_score_avg": s.focus_score_avg,
                "attention_percentage": s.attention_percentage,
            }
            for s in sessions
        ]
        
        return {
            "sessions": sessions_data,
            "total": total,
            "limit": limit,
            "offset": offset,
        }
    except Exception as e:
        logger.error(f"Error getting sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/focus-timeline/{session_id}")
async def get_focus_timeline(session_id: int, db: Session = Depends(get_db)):
    """Get focus score timeline for a session"""
    try:
        metrics = db.query(FocusMetric).filter(
            FocusMetric.session_id == session_id
        ).order_by(FocusMetric.timestamp).all()
        
        if not metrics:
            raise HTTPException(status_code=404, detail="No metrics found for session")
        
        timeline = [
            {
                "timestamp": m.timestamp.isoformat(),
                "focus_score": m.focus_score,
                "attention": m.attention,
                "drowsiness": m.drowsiness,
            }
            for m in metrics
        ]
        
        return {
            "session_id": session_id,
            "timeline": timeline,
            "count": len(timeline),
        }
    except Exception as e:
        logger.error(f"Error getting focus timeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))
