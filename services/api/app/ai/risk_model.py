"""
Risk prediction model - simulated ML for hackathon demo
Production would use trained XGBoost/RandomForest with historical breach data
"""
import numpy as np
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.models import Loan, CovenantCheck


class RiskPredictionModel:
    """
    Simulated risk model - gives realistic predictions for demo
    TODO: Replace with actual trained model using historical loan data
    """
    
    def __init__(self):
        # Random weights for demo - in prod these come from training
        np.random.seed(42)  # Reproducible for demo
        self.weights = np.random.randn(18) * 0.1
        self.bias = 0.0
    
    def predict_breach_probability(
        self,
        features: np.ndarray,
        prediction_horizon_days: int
    ) -> float:
        """
        Predict breach probability - simple linear + sigmoid for demo
        Real model would use ensemble methods with feature importance
        """
        # Basic linear combination
        raw_score = np.dot(features, self.weights) + self.bias
        
        # Longer horizons = more uncertainty (simple heuristic)
        horizon_factor = 1.0 + (prediction_horizon_days / 365.0) * 0.2
        adjusted_score = raw_score * horizon_factor
        
        # Sigmoid to bound between 0-1
        probability = 1.0 / (1.0 + np.exp(-adjusted_score))
        
        # Small noise for demo realism - remove in production
        noise = np.random.normal(0, 0.05)
        probability = np.clip(probability + noise, 0.0, 1.0)
        
        return float(probability)
    
    def predict_risk_level(self, probability: float) -> str:
        """Convert probability to risk level"""
        if probability < 0.3:
            return "low"
        elif probability < 0.6:
            return "medium"
        elif probability < 0.8:
            return "high"
        else:
            return "critical"
    
    def identify_risk_factors(
        self,
        loan: Loan,
        covenant_checks: List[CovenantCheck],
        features: np.ndarray
    ) -> List[Dict[str, Any]]:
        """
        Identify which factors contribute most to risk
        
        Returns:
            List of risk factors with explanations
        """
        risk_factors = []
        
        # Check historical breaches
        if covenant_checks:
            recent_breaches = sum(
                1 for check in covenant_checks[-5:]
                if check.is_breached
            )
            if recent_breaches > 0:
                risk_factors.append({
                    "factor": "Historical Breaches",
                    "severity": "high",
                    "description": f"{recent_breaches} recent covenant breach(es) detected",
                    "impact": "high"
                })
        
        # Check loan maturity
        days_to_maturity = (loan.maturity_date - datetime.now()).days
        if days_to_maturity < 180:
            risk_factors.append({
                "factor": "Approaching Maturity",
                "severity": "medium",
                "description": f"Loan matures in {days_to_maturity} days",
                "impact": "medium"
            })
        
        # Check covenant count
        if len(loan.covenants) > 5:
            risk_factors.append({
                "factor": "High Covenant Count",
                "severity": "low",
                "description": f"{len(loan.covenants)} active covenants increase monitoring complexity",
                "impact": "low"
            })
        
        # Check interest rate
        if loan.interest_rate > 8.0:
            risk_factors.append({
                "factor": "High Interest Rate",
                "severity": "medium",
                "description": f"Interest rate of {loan.interest_rate}% indicates higher risk profile",
                "impact": "medium"
            })
        
        return risk_factors

