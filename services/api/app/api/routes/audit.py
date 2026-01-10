"""
Audit API Routes
Handles audit log retrieval
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
from app.services.service_instances import audit_service
from app.services.audit_service import AuditEventType

router = APIRouter()


@router.get("/audit", response_model=list)
async def get_audit_logs(
    loan_id: Optional[str] = None,
    event_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Get audit logs with optional filtering
    
    Args:
        loan_id: Filter by loan ID
        event_type: Filter by event type
        start_date: Filter by start date (ISO format)
        end_date: Filter by end date (ISO format)
    
    Returns:
        List of audit log entries
    """
    # Parse dates
    start = None
    end = None
    
    if start_date:
        try:
            start = datetime.fromisoformat(start_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_date format. Use ISO format.")
    
    if end_date:
        try:
            end = datetime.fromisoformat(end_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_date format. Use ISO format.")
    
    # Parse event type
    event_type_enum = None
    if event_type:
        try:
            event_type_enum = AuditEventType(event_type)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid event_type. Must be one of: {[e.value for e in AuditEventType]}"
            )
    
    # Get logs
    logs = audit_service.get_audit_logs(
        loan_id=loan_id,
        event_type=event_type_enum,
        start_date=start,
        end_date=end
    )
    
    return logs


@router.get("/audit/{loan_id}/summary", response_model=dict)
async def get_audit_summary(loan_id: str):
    """
    Get audit summary for a specific loan
    
    Returns:
        Audit summary with event counts and latest events
    """
    summary = audit_service.get_audit_summary(loan_id)
    return summary


@router.get("/audit/events/types", response_model=list)
async def get_event_types():
    """Get list of all available audit event types"""
    return [{"value": e.value, "name": e.name} for e in AuditEventType]

