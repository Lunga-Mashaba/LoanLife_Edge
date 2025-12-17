"""
Audit Service
Manages immutable audit logs for all system actions
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
from enum import Enum
import uuid


class AuditEventType(str, Enum):
    """Types of audit events"""
    LOAN_CREATED = "loan_created"
    LOAN_UPDATED = "loan_updated"
    DOCUMENT_UPLOADED = "document_uploaded"
    COVENANT_CHECKED = "covenant_checked"
    COVENANT_BREACHED = "covenant_breached"
    PREDICTION_GENERATED = "prediction_generated"
    ESG_SCORE_CALCULATED = "esg_score_calculated"
    ESG_NON_COMPLIANCE = "esg_non_compliance"
    GOVERNANCE_ACTION = "governance_action"
    APPROVAL_REQUESTED = "approval_requested"
    APPROVAL_GRANTED = "approval_granted"
    APPROVAL_DENIED = "approval_denied"
    REMEDIATION_ACTION = "remediation_action"


class AuditService:
    """Service for managing audit logs"""
    
    def __init__(self):
        # In-memory storage for demo (replace with blockchain/immutable storage in production)
        self.audit_logs: List[Dict[str, Any]] = []
    
    def log_event(
        self,
        event_type: AuditEventType,
        loan_id: str,
        user_id: str,
        description: str,
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Log an audit event
        
        Args:
            event_type: Type of event
            loan_id: Associated loan ID
            user_id: User who triggered the event
            description: Human-readable description
            metadata: Additional event data
        
        Returns:
            Created audit log entry
        """
        log_entry = {
            "id": str(uuid.uuid4()),
            "event_type": event_type.value,
            "loan_id": loan_id,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "description": description,
            "metadata": metadata or {},
            "hash": self._calculate_hash(event_type, loan_id, description, metadata)
        }
        
        self.audit_logs.append(log_entry)
        return log_entry
    
    def get_audit_logs(
        self,
        loan_id: Optional[str] = None,
        event_type: Optional[AuditEventType] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve audit logs with optional filtering
        
        Args:
            loan_id: Filter by loan ID
            event_type: Filter by event type
            start_date: Filter by start date
            end_date: Filter by end date
        
        Returns:
            List of audit log entries
        """
        logs = self.audit_logs.copy()
        
        # Apply filters
        if loan_id:
            logs = [log for log in logs if log["loan_id"] == loan_id]
        
        if event_type:
            logs = [log for log in logs if log["event_type"] == event_type.value]
        
        if start_date:
            logs = [
                log for log in logs
                if datetime.fromisoformat(log["timestamp"]) >= start_date
            ]
        
        if end_date:
            logs = [
                log for log in logs
                if datetime.fromisoformat(log["timestamp"]) <= end_date
            ]
        
        # Sort by timestamp (newest first)
        logs.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return logs
    
    def get_audit_summary(self, loan_id: str) -> Dict[str, Any]:
        """Get audit summary for a loan"""
        loan_logs = self.get_audit_logs(loan_id=loan_id)
        
        # Count events by type
        event_counts = {}
        for log in loan_logs:
            event_type = log["event_type"]
            event_counts[event_type] = event_counts.get(event_type, 0) + 1
        
        # Get latest events
        latest_events = loan_logs[:10] if len(loan_logs) > 10 else loan_logs
        
        return {
            "loan_id": loan_id,
            "total_events": len(loan_logs),
            "event_counts": event_counts,
            "latest_events": latest_events,
            "first_event": loan_logs[-1] if loan_logs else None,
            "last_event": loan_logs[0] if loan_logs else None
        }
    
    def _calculate_hash(
        self,
        event_type: AuditEventType,
        loan_id: str,
        description: str,
        metadata: Dict[str, Any]
    ) -> str:
        """Calculate hash for audit log entry (for immutability verification)"""
        import hashlib
        import json
        
        content = {
            "event_type": event_type.value,
            "loan_id": loan_id,
            "description": description,
            "metadata": metadata or {}
        }
        
        content_str = json.dumps(content, sort_keys=True)
        return hashlib.sha256(content_str.encode()).hexdigest()

