"""
Loan API routes - document upload, CRUD operations
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Optional
from datetime import datetime
import tempfile
import os

from app.models import Loan, LoanDocument
from app.services.ingestion_service import IngestionService
from app.services.service_instances import twin_service, audit_service
from app.services.audit_service import AuditEventType

# Optional blockchain integration - check environment variable first
BLOCKCHAIN_ENABLED = os.getenv("BLOCKCHAIN_ENABLED", "false").lower() == "true"
blockchain_client = None
if BLOCKCHAIN_ENABLED:
    try:
        from app.services.blockchain_client import get_blockchain_client
        blockchain_client = get_blockchain_client()
        # Verify client is actually enabled and available
        if not blockchain_client.enabled:
            blockchain_client = None
            BLOCKCHAIN_ENABLED = False
    except Exception:
        # Graceful fallback - continue without blockchain
        blockchain_client = None
        BLOCKCHAIN_ENABLED = False

router = APIRouter()

# Service instances - in prod would use dependency injection
ingestion_service = IngestionService()


@router.post("/loans/upload", response_model=dict)
async def upload_loan_document(
    file: UploadFile = File(...),
    user_id: str = "analyst"  # TODO: Get from JWT/auth token
):
    """
    Upload loan doc and create digital twin
    Returns the created loan with extracted covenants/ESG
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ['.pdf', '.docx']:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Supported: .pdf, .docx"
        )
    
    # Write to temp file for processing
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_path = tmp_file.name
    
    try:
        # Process document
        extracted_data = ingestion_service.process_document(tmp_path, file.filename)
        
        # Extract metadata
        metadata = extracted_data["metadata"]
        covenants = extracted_data["covenants"]
        esg_clauses = extracted_data["esg_clauses"]
        
        # Create digital twin
        borrower_name = metadata.get("borrower_name", "Unknown Borrower")
        loan_amount = metadata.get("loan_amount", 1000000.0)
        interest_rate = metadata.get("interest_rate", 5.5)
        
        # Default dates
        start_date = datetime.now()
        maturity_date = datetime.now().replace(year=start_date.year + 5)
        
        loan = twin_service.create_digital_twin(
            borrower_name=borrower_name,
            loan_amount=loan_amount,
            interest_rate=interest_rate,
            start_date=start_date,
            maturity_date=maturity_date,
            covenants=covenants,
            esg_clauses=esg_clauses,
            metadata={
                **metadata,
                "source_document": file.filename,
                "upload_date": datetime.now().isoformat()
            }
        )
        
        # Update document with loan ID
        loan_doc = extracted_data["document"]
        loan_doc.loan_id = loan.id
        
        # Log audit event
        audit_service.log_event(
            event_type=AuditEventType.DOCUMENT_UPLOADED,
            loan_id=loan.id,
            user_id=user_id,
            description=f"Document uploaded: {file.filename}",
            metadata={"filename": file.filename, "file_type": file_ext}
        )
        
        audit_service.log_event(
            event_type=AuditEventType.LOAN_CREATED,
            loan_id=loan.id,
            user_id=user_id,
            description=f"Loan digital twin created for {borrower_name}",
            metadata={"loan_amount": loan_amount, "covenants_count": len(covenants)}
        )
        
        # Register covenants on blockchain (non-blocking)
        if BLOCKCHAIN_ENABLED and blockchain_client:
            try:
                for covenant in covenants:
                    blockchain_result = blockchain_client.register_covenant(
                        loan_id=loan.id,
                        covenant_data={
                            "id": covenant.id,
                            "name": covenant.name,
                            "type": covenant.type,
                            "threshold": covenant.threshold,
                            "operator": covenant.operator
                        }
                    )
                    # Log blockchain result but don't fail if it doesn't work
                    if not blockchain_result.get("success"):
                        pass  # Graceful degradation
            except Exception as e:
                # Blockchain registration failed - continue without it
                pass
        
        # Convert document dict to match frontend type (upload_date -> uploaded_at)
        doc_dict = loan_doc.dict()
        if "upload_date" in doc_dict:
            doc_dict["uploaded_at"] = doc_dict.pop("upload_date")
        
        return {
            "loan": loan.dict(),
            "document": doc_dict,
            "extracted": {
                "covenants_count": len(covenants),
                "esg_clauses_count": len(esg_clauses)
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")
    
    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@router.get("/loans", response_model=List[dict])
async def get_all_loans():
    """Get all loan digital twins"""
    loans = twin_service.get_all_twins()
    return [loan.dict() for loan in loans]


@router.get("/loans/{loan_id}", response_model=dict)
async def get_loan(loan_id: str):
    """Get a specific loan digital twin"""
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan.dict()


@router.get("/loans/{loan_id}/state", response_model=dict)
async def get_loan_state(loan_id: str):
    """Get complete digital twin state including health metrics"""
    state = twin_service.get_twin_state(loan_id)
    if not state:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Transform to match frontend expectations
    health_metrics = state.get("health_metrics", {})
    total_covenants = health_metrics.get("total_covenants", 0)
    breached_covenants = health_metrics.get("breached_covenants", 0)
    at_risk_covenants = health_metrics.get("at_risk_covenants", 0)
    compliant_covenants = total_covenants - breached_covenants - at_risk_covenants
    
    total_esg = health_metrics.get("total_esg_clauses", 0)
    non_compliant_esg = health_metrics.get("non_compliant_esg", 0)
    at_risk_esg = 0  # Not tracked separately in backend yet
    compliant_esg = total_esg - non_compliant_esg - at_risk_esg
    
    # Calculate health score (0-100)
    compliance_rate = health_metrics.get("compliance_rate", 1.0)
    esg_compliance_rate = health_metrics.get("esg_compliance_rate", 1.0)
    health_score = int((compliance_rate * 0.7 + esg_compliance_rate * 0.3) * 100)
    
    return {
        "loan": state.get("loan", {}),
        "health_score": health_score,
        "covenant_status": {
            "compliant": max(0, compliant_covenants),
            "at_risk": at_risk_covenants,
            "breached": breached_covenants
        },
        "esg_status": {
            "compliant": max(0, compliant_esg),
            "at_risk": at_risk_esg,
            "non_compliant": non_compliant_esg
        },
        "last_updated": state.get("last_updated", "")
    }


@router.post("/loans/{loan_id}/covenant-check", response_model=dict)
async def record_covenant_check(
    loan_id: str,
    covenant_id: str,
    actual_value: float,
    notes: Optional[str] = None,
    user_id: str = "analyst"
):
    """
    Record a covenant check result
    
    Args:
        loan_id: Loan ID
        covenant_id: Covenant ID
        actual_value: Actual measured value
        notes: Optional notes
        user_id: User performing the check
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Find covenant
    covenant = next((c for c in loan.covenants if c.id == covenant_id), None)
    if not covenant:
        raise HTTPException(status_code=404, detail="Covenant not found")
    
    # Evaluate covenant breach
    is_breached = _evaluate_covenant(covenant, actual_value)
    
    # Determine status - "at_risk" if close to threshold
    threshold_pct_diff = abs(actual_value - covenant.threshold) / covenant.threshold if covenant.threshold != 0 else float('inf')
    if is_breached:
        status = "breached"
    elif threshold_pct_diff < 0.1:  # Within 10% of threshold
        status = "at_risk"
    else:
        status = "compliant"
    
    # Record check
    check = twin_service.add_covenant_check(
        loan_id=loan_id,
        covenant_id=covenant_id,
        check_date=datetime.now(),
        status=status,
        actual_value=actual_value,
        threshold_value=covenant.threshold,
        is_breached=is_breached,
        notes=notes
    )
    
    # Log audit event
    event_type = AuditEventType.COVENANT_BREACHED if is_breached else AuditEventType.COVENANT_CHECKED
    audit_service.log_event(
        event_type=event_type,
        loan_id=loan_id,
        user_id=user_id,
        description=f"Covenant check: {covenant.name} - {'BREACHED' if is_breached else 'Compliant'}",
        metadata={
            "covenant_id": covenant_id,
            "actual_value": actual_value,
            "threshold": covenant.threshold,
            "is_breached": is_breached
        }
    )
    
    return check.dict()


def _evaluate_covenant(covenant, actual_value: float) -> bool:
    """Check if covenant is breached based on operator and threshold"""
    threshold = covenant.threshold
    operator = covenant.operator
    
    # Handle different comparison operators
    if operator == ">":
        return actual_value <= threshold
    elif operator == "<":
        return actual_value >= threshold
    elif operator == ">=":
        return actual_value < threshold
    elif operator == "<=":
        return actual_value > threshold
    elif operator == "==":
        # Use small epsilon for float comparison
        return abs(actual_value - threshold) > 0.01
    else:
        # Unknown operator - default to not breached (conservative)
        return False

