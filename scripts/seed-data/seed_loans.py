"""
Seed data script - creates sample loans for demo
Run this to populate the API with demo data
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root / "services" / "api"))

from app.services.service_instances import twin_service, audit_service
from app.models import Loan, Covenant, ESGClause
from app.services.audit_service import AuditEventType


def create_sample_loans():
    """Create sample loans with realistic data for demo"""
    # Uses shared service instances so data is visible to API
    
    # Sample Loan 1: Tech Startup
    loan1 = twin_service.create_digital_twin(
        borrower_name="TechStartup Inc.",
        loan_amount=5000000.0,
        interest_rate=6.5,
        start_date=datetime.now() - timedelta(days=180),
        maturity_date=datetime.now() + timedelta(days=1825),  # 5 years
        covenants=[
            Covenant(
                id="covenant-1-1",
                name="Debt-to-Equity Ratio",
                type="financial",
                threshold=2.0,
                operator="<=",
                frequency="quarterly",
                next_check_date=datetime.now() + timedelta(days=30),
                description="Maintain debt-to-equity ratio below 2.0"
            ),
            Covenant(
                id="covenant-1-2",
                name="Current Ratio",
                type="financial",
                threshold=1.5,
                operator=">=",
                frequency="quarterly",
                next_check_date=datetime.now() + timedelta(days=30),
                description="Maintain current ratio above 1.5"
            ),
        ],
        esg_clauses=[
            ESGClause(
                id="esg-1-1",
                category="environmental",
                requirement="Carbon emissions reporting",
                reporting_frequency="annually",
                next_report_date=datetime.now() + timedelta(days=90),
                description="Annual carbon footprint report required"
            ),
            ESGClause(
                id="esg-1-2",
                category="governance",
                requirement="Board diversity compliance",
                reporting_frequency="annually",
                next_report_date=datetime.now() + timedelta(days=90),
                description="Board composition reporting"
            ),
        ],
        metadata={
            "industry": "Technology",
            "loan_type": "Term Loan",
            "purpose": "Working Capital"
        }
    )
    
    # Add some covenant checks for loan1
    twin_service.add_covenant_check(
        loan_id=loan1.id,
        covenant_id="covenant-1-1",
        check_date=datetime.now() - timedelta(days=60),
        status="compliant",
        actual_value=1.8,
        threshold_value=2.0,
        is_breached=False,
        notes="Within acceptable range"
    )
    
    twin_service.add_covenant_check(
        loan_id=loan1.id,
        covenant_id="covenant-1-2",
        check_date=datetime.now() - timedelta(days=60),
        status="at_risk",
        actual_value=1.52,
        threshold_value=1.5,
        is_breached=False,
        notes="Close to threshold, monitor closely"
    )
    
    # Sample Loan 2: Manufacturing Company
    loan2 = twin_service.create_digital_twin(
        borrower_name="Manufacturing Corp",
        loan_amount=15000000.0,
        interest_rate=5.2,
        start_date=datetime.now() - timedelta(days=365),
        maturity_date=datetime.now() + timedelta(days=1460),  # 4 years
        covenants=[
            Covenant(
                id="covenant-2-1",
                name="Interest Coverage Ratio",
                type="financial",
                threshold=3.0,
                operator=">=",
                frequency="quarterly",
                next_check_date=datetime.now() + timedelta(days=45),
                description="Interest coverage must be at least 3.0x"
            ),
            Covenant(
                id="covenant-2-2",
                name="Minimum Equity",
                type="financial",
                threshold=10000000.0,
                operator=">=",
                frequency="quarterly",
                next_check_date=datetime.now() + timedelta(days=45),
                description="Maintain minimum equity of $10M"
            ),
        ],
        esg_clauses=[
            ESGClause(
                id="esg-2-1",
                category="environmental",
                requirement="Waste management compliance",
                reporting_frequency="quarterly",
                next_report_date=datetime.now() + timedelta(days=30),
                description="Quarterly waste reduction reporting"
            ),
            ESGClause(
                id="esg-2-2",
                category="social",
                requirement="Workplace safety standards",
                reporting_frequency="quarterly",
                next_report_date=datetime.now() + timedelta(days=30),
                description="OSHA compliance reporting"
            ),
        ],
        metadata={
            "industry": "Manufacturing",
            "loan_type": "Term Loan",
            "purpose": "Equipment Purchase"
        }
    )
    
    # Add covenant check showing a breach
    twin_service.add_covenant_check(
        loan_id=loan2.id,
        covenant_id="covenant-2-1",
        check_date=datetime.now() - timedelta(days=30),
        status="breached",
        actual_value=2.5,
        threshold_value=3.0,
        is_breached=True,
        notes="BREACHED: Interest coverage below threshold"
    )
    
    # Sample Loan 3: Retail Chain
    loan3 = twin_service.create_digital_twin(
        borrower_name="Retail Chain LLC",
        loan_amount=8000000.0,
        interest_rate=7.0,
        start_date=datetime.now() - timedelta(days=90),
        maturity_date=datetime.now() + timedelta(days=1095),  # 3 years
        covenants=[
            Covenant(
                id="covenant-3-1",
                name="Quick Ratio",
                type="financial",
                threshold=1.0,
                operator=">=",
                frequency="monthly",
                next_check_date=datetime.now() + timedelta(days=15),
                description="Maintain quick ratio above 1.0"
            ),
        ],
        esg_clauses=[
            ESGClause(
                id="esg-3-1",
                category="social",
                requirement="Supply chain ethics",
                reporting_frequency="annually",
                next_report_date=datetime.now() + timedelta(days=120),
                description="Annual supply chain audit"
            ),
        ],
        metadata={
            "industry": "Retail",
            "loan_type": "Line of Credit",
            "purpose": "Inventory Financing"
        }
    )
    
    # Log audit events
    for loan in [loan1, loan2, loan3]:
        audit_service.log_event(
            event_type=AuditEventType.LOAN_CREATED,
            loan_id=loan.id,
            user_id="system",
            description=f"Demo loan created: {loan.borrower_name}",
            metadata={"source": "seed_script", "loan_amount": loan.loan_amount}
        )
    
    print(f"✅ Created {len([loan1, loan2, loan3])} sample loans")
    print(f"   - {loan1.borrower_name} (${loan1.loan_amount:,.0f})")
    print(f"   - {loan2.borrower_name} (${loan2.loan_amount:,.0f})")
    print(f"   - {loan3.borrower_name} (${loan3.loan_amount:,.0f})")
    print("\n⚠️  Note: This uses in-memory storage. Restart API to reset data.")
    
    return [loan1, loan2, loan3]


if __name__ == "__main__":
    print("Seeding demo loans...")
    loans = create_sample_loans()
    print("\n✅ Seed data created successfully!")
    print("\nTo use this data, the API server must be running and using the same service instances.")
    print("In production, this would write to a database.")

