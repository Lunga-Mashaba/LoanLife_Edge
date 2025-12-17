"""
ESG API Routes
Handles ESG scoring and compliance tracking
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
from app.models import ESGStatus
from app.services.digital_twin_service import DigitalTwinService
from app.services.esg_service import ESGService
from app.services.audit_service import AuditService, AuditEventType

router = APIRouter()

# Initialize services
twin_service = DigitalTwinService()
esg_service = ESGService()
audit_service = AuditService()


@router.get("/esg/{loan_id}/score", response_model=dict)
async def get_esg_score(loan_id: str):
    """
    Get ESG score for a loan
    
    Returns:
        ESG score breakdown by category
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Get compliance records
    compliance_records = twin_service.get_esg_compliance(loan_id)
    
    # Calculate score
    score = esg_service.calculate_esg_score(loan, compliance_records)
    
    # Log audit event
    audit_service.log_event(
        event_type=AuditEventType.ESG_SCORE_CALCULATED,
        loan_id=loan_id,
        user_id="system",
        description=f"ESG score calculated: {score.overall_score:.1f}",
        metadata={"overall_score": score.overall_score}
    )
    
    return score.dict()


@router.get("/esg/{loan_id}/compliance", response_model=dict)
async def get_esg_compliance_summary(loan_id: str):
    """
    Get ESG compliance summary for a loan
    
    Returns:
        Compliance status by category
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Get compliance records
    compliance_records = twin_service.get_esg_compliance(loan_id)
    
    # Get summary
    summary = esg_service.get_esg_compliance_summary(loan, compliance_records)
    
    return summary


@router.get("/esg/{loan_id}/breach-risk", response_model=dict)
async def get_esg_breach_risk(
    loan_id: str,
    horizon_days: int = 90
):
    """
    Predict ESG breach risk
    
    Args:
        loan_id: Loan ID
        horizon_days: Prediction horizon in days (default: 90)
    
    Returns:
        ESG breach risk prediction
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Get compliance records
    compliance_records = twin_service.get_esg_compliance(loan_id)
    
    # Predict breach risk
    prediction = esg_service.predict_esg_breach_risk(
        loan=loan,
        compliance_records=compliance_records,
        horizon_days=horizon_days
    )
    
    return prediction


@router.post("/esg/{loan_id}/compliance-check", response_model=dict)
async def record_esg_compliance_check(
    loan_id: str,
    clause_id: str,
    status: str,
    evidence: Optional[str] = None,
    notes: Optional[str] = None,
    user_id: str = "analyst"
):
    """
    Record an ESG compliance check
    
    Args:
        loan_id: Loan ID
        clause_id: ESG clause ID
        status: Compliance status (compliant, at_risk, non_compliant)
        evidence: Optional evidence
        notes: Optional notes
        user_id: User performing the check
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Validate clause exists
    clause = next((c for c in loan.esg_clauses if c.id == clause_id), None)
    if not clause:
        raise HTTPException(status_code=404, detail="ESG clause not found")
    
    # Validate status
    try:
        esg_status = ESGStatus(status)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {[s.value for s in ESGStatus]}"
        )
    
    # Record compliance
    compliance = twin_service.add_esg_compliance(
        loan_id=loan_id,
        clause_id=clause_id,
        check_date=datetime.now(),
        status=esg_status.value,
        evidence=evidence,
        notes=notes
    )
    
    # Log audit event
    event_type = AuditEventType.ESG_NON_COMPLIANCE if status == "non_compliant" else AuditEventType.ESG_SCORE_CALCULATED
    audit_service.log_event(
        event_type=event_type,
        loan_id=loan_id,
        user_id=user_id,
        description=f"ESG compliance check: {clause.category} - {status}",
        metadata={
            "clause_id": clause_id,
            "status": status,
            "category": clause.category
        }
    )
    
    return compliance.dict()

