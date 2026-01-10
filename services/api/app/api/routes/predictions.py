"""
Risk Prediction API Routes
Handles AI-based risk predictions
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models import Loan
from app.services.service_instances import twin_service, audit_service
from app.services.prediction_service import PredictionService
from app.services.audit_service import AuditEventType

router = APIRouter()

# Initialize services
prediction_service = PredictionService()


@router.get("/predictions/{loan_id}", response_model=dict)
async def get_risk_predictions(
    loan_id: str,
    horizons: Optional[str] = "30,60,90"
):
    """
    Get AI risk predictions for a loan
    
    Args:
        loan_id: Loan ID
        horizons: Comma-separated list of prediction horizons in days (default: 30,60,90)
    
    Returns:
        Risk predictions for multiple time horizons
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Parse horizons
    try:
        horizon_list = [int(h.strip()) for h in horizons.split(",")]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid horizons format. Use comma-separated integers.")
    
    # Get covenant checks
    covenant_checks = twin_service.get_covenant_checks(loan_id)
    
    # Generate predictions
    predictions = prediction_service.predict_risk(
        loan=loan,
        covenant_checks=covenant_checks,
        prediction_horizons=horizon_list
    )
    
    # Log audit event
    audit_service.log_event(
        event_type=AuditEventType.PREDICTION_GENERATED,
        loan_id=loan_id,
        user_id="system",
        description=f"Risk prediction generated for horizons: {horizons}",
        metadata={
            "horizons": horizon_list,
            "overall_risk": predictions["overall_risk"]["level"]
        }
    )
    
    return predictions


@router.get("/predictions/{loan_id}/covenant/{covenant_id}", response_model=dict)
async def get_covenant_specific_prediction(
    loan_id: str,
    covenant_id: str,
    horizon_days: int = 30
):
    """
    Get risk prediction for a specific covenant
    
    Args:
        loan_id: Loan ID
        covenant_id: Covenant ID
        horizon_days: Prediction horizon in days (default: 30)
    
    Returns:
        Risk prediction for the specific covenant
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Get covenant checks
    covenant_checks = twin_service.get_covenant_checks(loan_id)
    
    # Generate prediction
    prediction = prediction_service.predict_covenant_specific_risk(
        loan=loan,
        covenant_id=covenant_id,
        covenant_checks=covenant_checks,
        horizon_days=horizon_days
    )
    
    return prediction


@router.get("/predictions/{loan_id}/explainability", response_model=dict)
async def get_prediction_explanation(
    loan_id: str,
    horizon_days: int = 30
):
    """
    Get detailed explainability for a risk prediction
    
    Args:
        loan_id: Loan ID
        horizon_days: Prediction horizon in days (default: 30)
    
    Returns:
        Detailed explanation of the prediction
    """
    loan = twin_service.get_digital_twin(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Get covenant checks
    covenant_checks = twin_service.get_covenant_checks(loan_id)
    
    # Generate prediction with explanation
    predictions = prediction_service.predict_risk(
        loan=loan,
        covenant_checks=covenant_checks,
        prediction_horizons=[horizon_days]
    )
    
    # Return the explanation for the requested horizon
    horizon_key = f"{horizon_days}_days"
    if horizon_key not in predictions["predictions"]:
        raise HTTPException(status_code=400, detail=f"Prediction for {horizon_days} days not available")
    
    return predictions["predictions"][horizon_key]["explanation"]

