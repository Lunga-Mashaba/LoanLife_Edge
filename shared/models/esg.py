"""
ESG-specific models
"""
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from enum import Enum


class ESGCategory(str, Enum):
    """ESG categories"""
    ENVIRONMENTAL = "environmental"
    SOCIAL = "social"
    GOVERNANCE = "governance"


class ESGStatus(str, Enum):
    """ESG compliance status"""
    COMPLIANT = "compliant"
    AT_RISK = "at_risk"
    NON_COMPLIANT = "non_compliant"
    PENDING_REVIEW = "pending_review"


class ESGScore(BaseModel):
    """Overall ESG score for a loan"""
    loan_id: str
    environmental_score: float = Field(ge=0, le=100)
    social_score: float = Field(ge=0, le=100)
    governance_score: float = Field(ge=0, le=100)
    overall_score: float = Field(ge=0, le=100)
    last_updated: datetime
    factors: Dict[str, Any] = {}


class ESGCompliance(BaseModel):
    """ESG compliance record"""
    clause_id: str
    loan_id: str
    check_date: datetime
    status: ESGStatus
    evidence: Optional[str] = None
    notes: Optional[str] = None
    metadata: Dict[str, Any] = {}

