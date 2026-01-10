"""
Risk prediction service - orchestrates feature engineering, model prediction, and explainability
"""
from datetime import datetime
from typing import Dict, Any, List
from app.models import Loan, CovenantCheck
from app.ai.feature_engineering import FeatureEngineer
from app.ai.risk_model import RiskPredictionModel
from app.ai.explainability import ExplainabilityEngine

# Optional blockchain integration for breach detection
try:
    from app.services.blockchain_client import get_blockchain_client
    BLOCKCHAIN_AVAILABLE = True
except ImportError:
    BLOCKCHAIN_AVAILABLE = False


class PredictionService:
    """Main service for risk predictions - coordinates AI components"""
    
    def __init__(self):
        self.feature_engineer = FeatureEngineer()
        self.risk_model = RiskPredictionModel()
        self.explainability = ExplainabilityEngine()
        
        # Optional blockchain client for breach detection
        self.blockchain_client = None
        if BLOCKCHAIN_AVAILABLE:
            try:
                self.blockchain_client = get_blockchain_client()
            except Exception:
                pass
    
    def predict_risk(
        self,
        loan: Loan,
        covenant_checks: List[CovenantCheck],
        prediction_horizons: List[int] = None
    ) -> Dict[str, Any]:
        """
        Generate risk predictions for multiple horizons
        Returns predictions with explanations for each time window
        """
        if prediction_horizons is None:
            prediction_horizons = [30, 60, 90]  # Standard horizons
        
        predictions = {}
        
        for horizon_days in prediction_horizons:
            # Engineer features
            features = self.feature_engineer.engineer_features(
                loan, covenant_checks, horizon_days
            )
            
            # Predict probability
            probability = self.risk_model.predict_breach_probability(
                features, horizon_days
            )
            
            # Determine risk level
            risk_level = self.risk_model.predict_risk_level(probability)
            
            # Identify risk factors
            risk_factors = self.risk_model.identify_risk_factors(
                loan, covenant_checks, features
            )
            
            # Generate explanation
            explanation = self.explainability.explain_prediction(
                loan, probability, risk_level, horizon_days, risk_factors
            )
            
            predictions[f"{horizon_days}_days"] = {
                "horizon_days": horizon_days,
                "probability": probability,
                "risk_level": risk_level,
                "explanation": explanation,
                "prediction_date": datetime.now().isoformat()
            }
        
        # Overall risk assessment
        overall_risk = self._calculate_overall_risk(predictions)
        
        result = {
            "loan_id": loan.id,
            "predictions": predictions,
            "overall_risk": overall_risk,
            "generated_at": datetime.now().isoformat()
        }
        
        # If critical/high risk, detect breach on blockchain (non-blocking)
        if self.blockchain_client and overall_risk["level"] in ["critical", "high"]:
            try:
                breach_id = f"breach-{loan.id}-{datetime.now().timestamp()}"
                blockchain_result = self.blockchain_client.detect_breach(
                    breach_id=breach_id,
                    loan_id=loan.id,
                    rule_id="ai-prediction-rule",
                    severity=3 if overall_risk["level"] == "critical" else 2,
                    predicted_value=overall_risk["max_probability"]
                )
                if blockchain_result.get("success"):
                    result["blockchain_breach_detected"] = {
                        "breach_id": breach_id,
                        "tx_hash": blockchain_result.get("transactionHash")
                    }
            except Exception:
                # Blockchain breach detection failed - continue without it
                pass
        
        return result
    
    def _calculate_overall_risk(self, predictions: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate overall risk assessment across all horizons"""
        probabilities = [
            pred["probability"]
            for pred in predictions.values()
        ]
        
        avg_probability = sum(probabilities) / len(probabilities)
        max_probability = max(probabilities)
        
        # Overall risk level based on worst-case scenario
        if max_probability >= 0.8:
            overall_level = "critical"
        elif max_probability >= 0.6:
            overall_level = "high"
        elif max_probability >= 0.4:
            overall_level = "medium"
        else:
            overall_level = "low"
        
        return {
            "level": overall_level,
            "average_probability": avg_probability,
            "max_probability": max_probability,
            "trend": "increasing" if probabilities[-1] > probabilities[0] else "stable"
        }
    
    def predict_covenant_specific_risk(
        self,
        loan: Loan,
        covenant_id: str,
        covenant_checks: List[CovenantCheck],
        horizon_days: int = 30
    ) -> Dict[str, Any]:
        """
        Predict risk for a specific covenant
        
        Returns:
            Risk prediction for the specific covenant
        """
        # Find the covenant
        covenant = next((c for c in loan.covenants if c.id == covenant_id), None)
        if not covenant:
            raise ValueError(f"Covenant {covenant_id} not found")
        
        # Filter checks for this covenant
        relevant_checks = [
            check for check in covenant_checks
            if check.covenant_id == covenant_id
        ]
        
        # Use general prediction but focus on this covenant
        features = self.feature_engineer.engineer_features(
            loan, covenant_checks, horizon_days
        )
        
        # Adjust probability based on covenant-specific history
        base_probability = self.risk_model.predict_breach_probability(
            features, horizon_days
        )
        
        # Adjust based on covenant history
        if relevant_checks:
            recent_breaches = sum(
                1 for check in relevant_checks[-3:]
                if check.is_breached
            )
            if recent_breaches > 0:
                base_probability = min(base_probability + 0.2, 1.0)
        
        risk_level = self.risk_model.predict_risk_level(base_probability)
        
        return {
            "covenant_id": covenant_id,
            "covenant_name": covenant.name,
            "horizon_days": horizon_days,
            "probability": base_probability,
            "risk_level": risk_level,
            "covenant_details": covenant.dict(),
            "historical_checks": len(relevant_checks),
            "prediction_date": datetime.now().isoformat()
        }

