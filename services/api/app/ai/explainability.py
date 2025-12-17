"""
Explainability engine - converts ML predictions into human-readable explanations
Critical for banking compliance - need to explain why model says what it does
"""
from typing import Dict, Any, List
from datetime import datetime
from app.models import Loan


class ExplainabilityEngine:
    """Generates explanations for predictions - helps users trust the model"""
    
    def explain_prediction(
        self,
        loan: Loan,
        probability: float,
        risk_level: str,
        prediction_horizon_days: int,
        risk_factors: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Build full explanation - main text, factors, recommendations
        Used by frontend to display to analysts
        """
        # Main explanation
        main_explanation = self._generate_main_explanation(
            probability, risk_level, prediction_horizon_days
        )
        
        # Factor-based explanation
        factor_explanation = self._explain_risk_factors(risk_factors)
        
        # Covenant-specific insights
        covenant_insights = self._generate_covenant_insights(loan)
        
        # Actionable recommendations
        recommendations = self._generate_recommendations(
            risk_level, risk_factors, loan
        )
        
        return {
            "main_explanation": main_explanation,
            "risk_level": risk_level,
            "probability": probability,
            "prediction_horizon_days": prediction_horizon_days,
            "risk_factors": risk_factors,
            "factor_explanation": factor_explanation,
            "covenant_insights": covenant_insights,
            "recommendations": recommendations,
            "confidence": self._calculate_confidence(risk_factors, probability)
        }
    
    def _generate_main_explanation(
        self,
        probability: float,
        risk_level: str,
        horizon_days: int
    ) -> str:
        """Generate main explanation text"""
        percentage = probability * 100
        
        if risk_level == "critical":
            return (
                f"CRITICAL RISK: There is a {percentage:.1f}% probability of a covenant breach "
                f"within the next {horizon_days} days. Immediate action is required."
            )
        elif risk_level == "high":
            return (
                f"HIGH RISK: There is a {percentage:.1f}% probability of a covenant breach "
                f"within the next {horizon_days} days. Close monitoring and proactive measures recommended."
            )
        elif risk_level == "medium":
            return (
                f"MODERATE RISK: There is a {percentage:.1f}% probability of a covenant breach "
                f"within the next {horizon_days} days. Enhanced monitoring is advised."
            )
        else:
            return (
                f"LOW RISK: There is a {percentage:.1f}% probability of a covenant breach "
                f"within the next {horizon_days} days. Current risk level is manageable."
            )
    
    def _explain_risk_factors(
        self,
        risk_factors: List[Dict[str, Any]]
    ) -> str:
        """Explain the identified risk factors"""
        if not risk_factors:
            return "No significant risk factors identified at this time."
        
        explanations = []
        for factor in risk_factors:
            explanations.append(
                f"- {factor['factor']}: {factor['description']} "
                f"(Severity: {factor['severity']})"
            )
        
        return "\n".join(explanations)
    
    def _generate_covenant_insights(self, loan: Loan) -> List[str]:
        """Generate insights about specific covenants"""
        insights = []
        
        # Check for upcoming covenant checks
        now = datetime.now()
        upcoming_checks = [
            c for c in loan.covenants
            if c.next_check_date > now
        ]
        
        if upcoming_checks:
            next_check = min(upcoming_checks, key=lambda x: x.next_check_date)
            days_until = (next_check.next_check_date - now).days
            insights.append(
                f"Next covenant check ({next_check.name}) in {days_until} days"
            )
        
        # Financial covenant insights
        financial_covenants = [c for c in loan.covenants if c.type == "financial"]
        if financial_covenants:
            insights.append(
                f"{len(financial_covenants)} financial covenant(s) require regular monitoring"
            )
        
        return insights
    
    def _generate_recommendations(
        self,
        risk_level: str,
        risk_factors: List[Dict[str, Any]],
        loan: Loan
    ) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if risk_level in ["high", "critical"]:
            recommendations.append(
                "Schedule immediate review meeting with borrower"
            )
            recommendations.append(
                "Request updated financial statements and performance metrics"
            )
            recommendations.append(
                "Consider covenant waivers or amendments if appropriate"
            )
        
        if risk_level == "medium":
            recommendations.append(
                "Increase monitoring frequency for at-risk covenants"
            )
            recommendations.append(
                "Request quarterly financial updates from borrower"
            )
        
        # Factor-specific recommendations
        for factor in risk_factors:
            if factor["severity"] == "high":
                if "Historical Breaches" in factor["factor"]:
                    recommendations.append(
                        "Implement enhanced monitoring and reporting requirements"
                    )
        
        if not recommendations:
            recommendations.append(
                "Continue standard monitoring procedures"
            )
        
        return recommendations
    
    def _calculate_confidence(
        self,
        risk_factors: List[Dict[str, Any]],
        probability: float
    ) -> float:
        """Calculate confidence score for the prediction"""
        # More risk factors = higher confidence
        factor_count = len(risk_factors)
        
        # Probability near extremes = higher confidence
        prob_confidence = abs(probability - 0.5) * 2
        
        # Combine factors
        confidence = min(0.5 + (factor_count * 0.1) + (prob_confidence * 0.3), 0.95)
        
        return confidence

