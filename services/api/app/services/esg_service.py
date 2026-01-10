"""
ESG scoring service - calculates scores and tracks compliance
Simple weighted scoring for demo, production would use more sophisticated metrics
"""
from datetime import datetime
from typing import Dict, Any, List
import random
from app.models import Loan, ESGClause, ESGCompliance, ESGScore, ESGStatus

# Optional blockchain integration
try:
    from app.services.blockchain_client import get_blockchain_client
    BLOCKCHAIN_AVAILABLE = True
except ImportError:
    BLOCKCHAIN_AVAILABLE = False


class ESGService:
    """Handles ESG scoring and breach risk prediction"""
    
    def __init__(self):
        self.blockchain_client = None
        if BLOCKCHAIN_AVAILABLE:
            try:
                self.blockchain_client = get_blockchain_client()
            except Exception:
                pass
    
    def calculate_esg_score(
        self,
        loan: Loan,
        compliance_records: List[ESGCompliance]
    ) -> ESGScore:
        """
        Calculate ESG score - starts at 100, deducts for non-compliance
        Simple approach for demo, production would use more nuanced scoring
        """
        # Initialize category scores
        environmental_score = 100.0
        social_score = 100.0
        governance_score = 100.0
        
        # Calculate scores based on compliance records
        for clause in loan.esg_clauses:
            clause_compliance = [
                comp for comp in compliance_records
                if comp.clause_id == clause.id
            ]
            
            if clause_compliance:
                latest = max(clause_compliance, key=lambda x: x.check_date)
                
                # Deduct points for non-compliance
                if latest.status == ESGStatus.NON_COMPLIANT:
                    deduction = 20.0
                elif latest.status == ESGStatus.AT_RISK:
                    deduction = 10.0
                else:
                    deduction = 0.0
                
                # Apply deduction to appropriate category
                if clause.category == "environmental":
                    environmental_score -= deduction
                elif clause.category == "social":
                    social_score -= deduction
                elif clause.category == "governance":
                    governance_score -= deduction
        
        # Ensure scores don't go below 0
        environmental_score = max(0.0, environmental_score)
        social_score = max(0.0, social_score)
        governance_score = max(0.0, governance_score)
        
        # Calculate overall score (weighted average)
        weights = {
            "environmental": 0.3,
            "social": 0.3,
            "governance": 0.4
        }
        
        overall_score = (
            environmental_score * weights["environmental"] +
            social_score * weights["social"] +
            governance_score * weights["governance"]
        )
        
        # Add small variability for demo realism
        environmental_score += random.uniform(-5, 5)
        social_score += random.uniform(-5, 5)
        governance_score += random.uniform(-5, 5)
        overall_score += random.uniform(-3, 3)
        
        # Clamp to valid range
        environmental_score = max(0.0, min(100.0, environmental_score))
        social_score = max(0.0, min(100.0, social_score))
        governance_score = max(0.0, min(100.0, governance_score))
        overall_score = max(0.0, min(100.0, overall_score))
        
        score = ESGScore(
            loan_id=loan.id,
            environmental_score=round(environmental_score, 1),
            social_score=round(social_score, 1),
            governance_score=round(governance_score, 1),
            overall_score=round(overall_score, 1),
            last_updated=datetime.now(),
            factors={
                "total_clauses": len(loan.esg_clauses),
                "compliance_records_count": len(compliance_records),
                "environmental_clauses": sum(
                    1 for c in loan.esg_clauses if c.category == "environmental"
                ),
                "social_clauses": sum(
                    1 for c in loan.esg_clauses if c.category == "social"
                ),
                "governance_clauses": sum(
                    1 for c in loan.esg_clauses if c.category == "governance"
                ),
            }
        )
        
        # Record ESG score on blockchain (non-blocking)
        if self.blockchain_client:
            try:
                blockchain_result = self.blockchain_client.record_esg_score(
                    loan_id=loan.id,
                    environmental=score.environmental_score,
                    social=score.social_score,
                    governance=score.governance_score
                )
                # Add blockchain info to factors if successful
                if blockchain_result.get("success"):
                    score.factors["blockchain_tx_hash"] = blockchain_result.get("transactionHash")
            except Exception:
                # Blockchain recording failed - continue without it
                pass
        
        return score
    
    def predict_esg_breach_risk(
        self,
        loan: Loan,
        compliance_records: List[ESGCompliance],
        horizon_days: int = 90
    ) -> Dict[str, Any]:
        """
        Predict risk of ESG non-compliance
        
        Returns:
            Prediction dictionary with risk assessment
        """
        # Calculate current score
        current_score = self.calculate_esg_score(loan, compliance_records)
        
        # Identify at-risk clauses
        at_risk_clauses = []
        for clause in loan.esg_clauses:
            clause_compliance = [
                comp for comp in compliance_records
                if comp.clause_id == clause.id
            ]
            
            if clause_compliance:
                latest = max(clause_compliance, key=lambda x: x.check_date)
                if latest.status in [ESGStatus.AT_RISK, ESGStatus.NON_COMPLIANT]:
                    at_risk_clauses.append({
                        "clause_id": clause.id,
                        "category": clause.category,
                        "requirement": clause.requirement,
                        "status": latest.status.value,
                        "last_check": latest.check_date.isoformat()
                    })
        
        # Calculate breach probability
        # Based on current score and at-risk clauses
        if current_score.overall_score < 50:
            breach_probability = 0.7
        elif current_score.overall_score < 70:
            breach_probability = 0.4
        elif len(at_risk_clauses) > 0:
            breach_probability = 0.3
        else:
            breach_probability = 0.1
        
        # Adjust for horizon
        breach_probability *= (1.0 + (horizon_days / 365.0) * 0.2)
        breach_probability = min(1.0, breach_probability)
        
        return {
            "loan_id": loan.id,
            "horizon_days": horizon_days,
            "breach_probability": round(breach_probability, 2),
            "current_score": current_score.dict(),
            "at_risk_clauses": at_risk_clauses,
            "risk_level": self._get_risk_level(breach_probability),
            "prediction_date": datetime.now().isoformat()
        }
    
    def _get_risk_level(self, probability: float) -> str:
        """Convert probability to risk level"""
        if probability >= 0.7:
            return "high"
        elif probability >= 0.4:
            return "medium"
        else:
            return "low"
    
    def get_esg_compliance_summary(
        self,
        loan: Loan,
        compliance_records: List[ESGCompliance]
    ) -> Dict[str, Any]:
        """Get summary of ESG compliance status"""
        score = self.calculate_esg_score(loan, compliance_records)
        
        # Count compliance by category
        compliance_by_category = {
            "environmental": {"compliant": 0, "at_risk": 0, "non_compliant": 0},
            "social": {"compliant": 0, "at_risk": 0, "non_compliant": 0},
            "governance": {"compliant": 0, "at_risk": 0, "non_compliant": 0}
        }
        
        for clause in loan.esg_clauses:
            clause_compliance = [
                comp for comp in compliance_records
                if comp.clause_id == clause.id
            ]
            
            if clause_compliance:
                latest = max(clause_compliance, key=lambda x: x.check_date)
                category = clause.category
                status = latest.status.value
                
                if status == "compliant":
                    compliance_by_category[category]["compliant"] += 1
                elif status == "at_risk":
                    compliance_by_category[category]["at_risk"] += 1
                elif status == "non_compliant":
                    compliance_by_category[category]["non_compliant"] += 1
        
        return {
            "loan_id": loan.id,
            "esg_score": score.dict(),
            "compliance_by_category": compliance_by_category,
            "total_clauses": len(loan.esg_clauses),
            "last_updated": datetime.now().isoformat()
        }

