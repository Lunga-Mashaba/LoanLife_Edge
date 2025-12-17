"""
Loan data model
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Covenant(BaseModel):
    """Represents a single loan covenant"""
    id: str
    name: str
    type: str  # e.g., "financial", "operational", "reporting"
    threshold: float
    operator: str  # e.g., ">", "<", ">=", "<=", "=="
    frequency: str  # e.g., "monthly", "quarterly", "annually"
    next_check_date: datetime
    description: Optional[str] = None


class ESGClause(BaseModel):
    """Represents an ESG compliance clause"""
    id: str
    category: str  # e.g., "environmental", "social", "governance"
    requirement: str
    reporting_frequency: str
    next_report_date: datetime
    description: Optional[str] = None


class Loan(BaseModel):
    """Core loan data model"""
    id: str
    borrower_name: str
    loan_amount: float
    interest_rate: float
    start_date: datetime
    maturity_date: datetime
    status: str = "active"  # active, closed, defaulted
    covenants: List[Covenant] = []
    esg_clauses: List[ESGClause] = []
    metadata: Dict[str, Any] = {}


class LoanDocument(BaseModel):
    """Represents an uploaded loan document"""
    id: str
    loan_id: str
    filename: str
    file_type: str  # pdf, docx
    upload_date: datetime
    extracted_data: Dict[str, Any] = {}

