"""
Digital twin service - manages loan state and lifecycle
Using in-memory dicts for hackathon, would use DB in production
"""
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from app.models import Loan, Covenant, ESGClause, CovenantCheck, ESGCompliance


class DigitalTwinService:
    """Manages loan digital twins - state, checks, compliance records"""
    
    def __init__(self):
        # In-memory for demo - easy to swap for DB later
        self.twins: Dict[str, Loan] = {}
        self.covenant_checks: Dict[str, List[CovenantCheck]] = {}
        self.esg_compliance: Dict[str, List[ESGCompliance]] = {}
        # TODO: Add persistence layer (SQLite for demo, Postgres for prod)
    
    def create_digital_twin(
        self,
        borrower_name: str,
        loan_amount: float,
        interest_rate: float,
        start_date: datetime,
        maturity_date: datetime,
        covenants: List[Covenant],
        esg_clauses: List[ESGClause],
        metadata: Dict[str, Any] = None
    ) -> Loan:
        """
        Create a new loan digital twin
        
        Args:
            borrower_name: Name of the borrower
            loan_amount: Total loan amount
            interest_rate: Annual interest rate
            start_date: Loan start date
            maturity_date: Loan maturity date
            covenants: List of covenants
            esg_clauses: List of ESG clauses
            metadata: Additional metadata
        
        Returns:
            Created Loan object
        """
        loan_id = str(uuid.uuid4())
        
        loan = Loan(
            id=loan_id,
            borrower_name=borrower_name,
            loan_amount=loan_amount,
            interest_rate=interest_rate,
            start_date=start_date,
            maturity_date=maturity_date,
            status="active",
            covenants=covenants,
            esg_clauses=esg_clauses,
            metadata=metadata or {}
        )
        
        self.twins[loan_id] = loan
        self.covenant_checks[loan_id] = []
        self.esg_compliance[loan_id] = []
        
        return loan
    
    def get_digital_twin(self, loan_id: str) -> Optional[Loan]:
        """Retrieve a digital twin by ID"""
        return self.twins.get(loan_id)
    
    def get_all_twins(self) -> List[Loan]:
        """Get all digital twins"""
        return list(self.twins.values())
    
    def update_twin_status(self, loan_id: str, status: str) -> bool:
        """Update the status of a digital twin"""
        if loan_id in self.twins:
            self.twins[loan_id].status = status
            return True
        return False
    
    def add_covenant_check(
        self,
        loan_id: str,
        covenant_id: str,
        check_date: datetime,
        status: str,
        actual_value: Optional[float],
        threshold_value: float,
        is_breached: bool,
        notes: Optional[str] = None
    ) -> CovenantCheck:
        """Record a covenant check result"""
        check = CovenantCheck(
            covenant_id=covenant_id,
            check_date=check_date,
            status=status,
            actual_value=actual_value,
            threshold_value=threshold_value,
            is_breached=is_breached,
            notes=notes
        )
        
        if loan_id not in self.covenant_checks:
            self.covenant_checks[loan_id] = []
        
        self.covenant_checks[loan_id].append(check)
        return check
    
    def get_covenant_checks(self, loan_id: str) -> List[CovenantCheck]:
        """Get all covenant checks for a loan"""
        return self.covenant_checks.get(loan_id, [])
    
    def add_esg_compliance(
        self,
        loan_id: str,
        clause_id: str,
        check_date: datetime,
        status: str,
        evidence: Optional[str] = None,
        notes: Optional[str] = None
    ) -> ESGCompliance:
        """Record an ESG compliance check"""
        compliance = ESGCompliance(
            clause_id=clause_id,
            loan_id=loan_id,
            check_date=check_date,
            status=status,
            evidence=evidence,
            notes=notes
        )
        
        if loan_id not in self.esg_compliance:
            self.esg_compliance[loan_id] = []
        
        self.esg_compliance[loan_id].append(compliance)
        return compliance
    
    def get_esg_compliance(self, loan_id: str) -> List[ESGCompliance]:
        """Get all ESG compliance records for a loan"""
        return self.esg_compliance.get(loan_id, [])
    
    def get_twin_state(self, loan_id: str) -> Dict[str, Any]:
        """Get full twin state with health metrics - used by frontend dashboard"""
        loan = self.get_digital_twin(loan_id)
        if not loan:
            return None
        
        covenant_checks = self.get_covenant_checks(loan_id)
        esg_compliance = self.get_esg_compliance(loan_id)
        
        # Calculate health metrics
        total_covenants = len(loan.covenants)
        breached_covenants = sum(1 for check in covenant_checks if check.is_breached)
        at_risk_covenants = sum(1 for check in covenant_checks if check.status == "at_risk")
        
        # ESG metrics
        total_esg_clauses = len(loan.esg_clauses)
        non_compliant_esg = sum(1 for comp in esg_compliance if comp.status == "non_compliant")
        
        # Avoid division by zero
        compliance_rate = (total_covenants - breached_covenants) / total_covenants if total_covenants > 0 else 1.0
        esg_compliance_rate = (total_esg_clauses - non_compliant_esg) / total_esg_clauses if total_esg_clauses > 0 else 1.0
        
        return {
            "loan": loan.dict(),
            "covenant_checks": [check.dict() for check in covenant_checks],
            "esg_compliance": [comp.dict() for comp in esg_compliance],
            "health_metrics": {
                "total_covenants": total_covenants,
                "breached_covenants": breached_covenants,
                "at_risk_covenants": at_risk_covenants,
                "compliance_rate": compliance_rate,
                "total_esg_clauses": total_esg_clauses,
                "non_compliant_esg": non_compliant_esg,
                "esg_compliance_rate": esg_compliance_rate
            },
            "last_updated": datetime.now().isoformat()
        }

