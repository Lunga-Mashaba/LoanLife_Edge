"""
Feature Engineering for Risk Prediction
Extracts features from loan data for ML models
"""
from datetime import datetime, timedelta
from typing import Dict, Any, List
import numpy as np
from app.models import Loan, CovenantCheck


class FeatureEngineer:
    """Engineers features from loan and covenant data for risk prediction"""
    
    def extract_loan_features(self, loan: Loan) -> Dict[str, float]:
        """Extract features from loan data"""
        now = datetime.now()
        days_to_maturity = (loan.maturity_date - now).days
        
        # Time-based features
        loan_age_days = (now - loan.start_date).days
        loan_age_years = loan_age_days / 365.0
        
        # Financial features
        loan_amount = loan.loan_amount
        interest_rate = loan.interest_rate
        
        # Covenant features
        total_covenants = len(loan.covenants)
        financial_covenants = sum(1 for c in loan.covenants if c.type == "financial")
        operational_covenants = sum(1 for c in loan.covenants if c.type == "operational")
        
        # ESG features
        total_esg_clauses = len(loan.esg_clauses)
        environmental_clauses = sum(1 for e in loan.esg_clauses if e.category == "environmental")
        social_clauses = sum(1 for e in loan.esg_clauses if e.category == "social")
        governance_clauses = sum(1 for e in loan.esg_clauses if e.category == "governance")
        
        return {
            "loan_amount": loan_amount,
            "interest_rate": interest_rate,
            "loan_age_years": loan_age_years,
            "days_to_maturity": days_to_maturity,
            "total_covenants": total_covenants,
            "financial_covenants": financial_covenants,
            "operational_covenants": operational_covenants,
            "total_esg_clauses": total_esg_clauses,
            "environmental_clauses": environmental_clauses,
            "social_clauses": social_clauses,
            "governance_clauses": governance_clauses,
        }
    
    def extract_covenant_history_features(
        self,
        covenant_checks: List[CovenantCheck]
    ) -> Dict[str, float]:
        """Extract features from covenant check history"""
        if not covenant_checks:
            return {
                "historical_breaches": 0.0,
                "historical_at_risk": 0.0,
                "avg_days_since_check": 0.0,
                "breach_rate": 0.0,
            }
        
        now = datetime.now()
        breaches = sum(1 for check in covenant_checks if check.is_breached)
        at_risk = sum(1 for check in covenant_checks if check.status == "at_risk")
        
        # Average days since last check
        days_since_checks = [
            (now - check.check_date).days for check in covenant_checks
        ]
        avg_days_since_check = np.mean(days_since_checks) if days_since_checks else 0.0
        
        breach_rate = breaches / len(covenant_checks) if covenant_checks else 0.0
        
        return {
            "historical_breaches": float(breaches),
            "historical_at_risk": float(at_risk),
            "avg_days_since_check": avg_days_since_check,
            "breach_rate": breach_rate,
        }
    
    def extract_temporal_features(
        self,
        loan: Loan,
        prediction_horizon_days: int
    ) -> Dict[str, float]:
        """Extract time-based features for prediction horizon"""
        now = datetime.now()
        
        # Days until next covenant check
        next_check_dates = [
            c.next_check_date for c in loan.covenants
            if c.next_check_date > now
        ]
        days_to_next_check = (
            min([(d - now).days for d in next_check_dates])
            if next_check_dates else 365.0
        )
        
        # Prediction horizon features
        prediction_date = now + timedelta(days=prediction_horizon_days)
        days_to_maturity_at_horizon = (loan.maturity_date - prediction_date).days
        
        return {
            "days_to_next_check": days_to_next_check,
            "prediction_horizon_days": float(prediction_horizon_days),
            "days_to_maturity_at_horizon": float(days_to_maturity_at_horizon),
        }
    
    def engineer_features(
        self,
        loan: Loan,
        covenant_checks: List[CovenantCheck],
        prediction_horizon_days: int = 30
    ) -> np.ndarray:
        """
        Engineer complete feature vector for risk prediction
        
        Returns:
            Feature vector as numpy array
        """
        loan_features = self.extract_loan_features(loan)
        history_features = self.extract_covenant_history_features(covenant_checks)
        temporal_features = self.extract_temporal_features(loan, prediction_horizon_days)
        
        # Combine all features
        all_features = {**loan_features, **history_features, **temporal_features}
        
        # Convert to array in consistent order
        feature_order = [
            "loan_amount",
            "interest_rate",
            "loan_age_years",
            "days_to_maturity",
            "total_covenants",
            "financial_covenants",
            "operational_covenants",
            "total_esg_clauses",
            "environmental_clauses",
            "social_clauses",
            "governance_clauses",
            "historical_breaches",
            "historical_at_risk",
            "avg_days_since_check",
            "breach_rate",
            "days_to_next_check",
            "prediction_horizon_days",
            "days_to_maturity_at_horizon",
        ]
        
        feature_vector = np.array([all_features.get(key, 0.0) for key in feature_order])
        
        # Normalize features (simple min-max normalization)
        # In production, use fitted scaler
        feature_vector = self._normalize_features(feature_vector)
        
        return feature_vector
    
    def _normalize_features(self, features: np.ndarray) -> np.ndarray:
        """Simple normalization (in production, use fitted scaler)"""
        # Avoid division by zero
        max_vals = np.maximum(np.abs(features), 1e-6)
        return features / max_vals

