"""
Covenant-specific models
"""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum


class CovenantType(str, Enum):
    """Types of covenants"""
    FINANCIAL = "financial"
    OPERATIONAL = "operational"
    REPORTING = "reporting"
    NEGATIVE = "negative"
    AFFIRMATIVE = "affirmative"


class CovenantStatus(str, Enum):
    """Covenant compliance status"""
    COMPLIANT = "compliant"
    AT_RISK = "at_risk"
    BREACHED = "breached"
    PENDING_CHECK = "pending_check"


class CovenantCheck(BaseModel):
    """Result of a covenant check"""
    covenant_id: str
    check_date: datetime
    status: CovenantStatus
    actual_value: Optional[float] = None
    threshold_value: float
    is_breached: bool
    notes: Optional[str] = None
    metadata: Dict[str, Any] = {}

