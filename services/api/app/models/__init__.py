# Import models from shared
import sys
from pathlib import Path

# Add shared directory to path
# Path: services/api/app/models/__init__.py
# Target: shared/models/
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent.parent.parent.parent
shared_path = project_root / "shared"
sys.path.insert(0, str(shared_path))

from models.loan import Loan, LoanDocument, Covenant, ESGClause
from models.covenant import CovenantCheck, CovenantStatus, CovenantType
from models.esg import ESGScore, ESGCompliance, ESGStatus, ESGCategory

__all__ = [
    "Loan",
    "LoanDocument",
    "Covenant",
    "ESGClause",
    "CovenantCheck",
    "CovenantStatus",
    "CovenantType",
    "ESGScore",
    "ESGCompliance",
    "ESGStatus",
    "ESGCategory",
]

