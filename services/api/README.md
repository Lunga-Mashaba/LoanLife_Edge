# LoanLife Edge - Backend API

Backend API service for LoanLife Edge, providing loan ingestion, digital twin management, AI risk prediction, ESG scoring, and audit logging.

## Overview

This service implements:
- **Loan Document Ingestion**: Parse PDF/DOCX loan documents and extract covenants, ESG clauses, and metadata
- **Digital Twin Engine**: Create and manage loan digital twins with complete state tracking
- **AI Risk Prediction**: Predict covenant breach risk at 30, 60, and 90-day horizons with explainability
- **ESG Scoring**: Calculate ESG scores and track compliance
- **Audit Logging**: Immutable audit trail of all system actions

## Setup

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. Navigate to the API directory:
```bash
cd services/api
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the API

### Development Server

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

### Production Server

For production, use a production ASGI server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

### Loans
- `POST /api/v1/loans/upload` - Upload and process loan document
- `GET /api/v1/loans` - Get all loans
- `GET /api/v1/loans/{loan_id}` - Get specific loan
- `GET /api/v1/loans/{loan_id}/state` - Get complete digital twin state
- `POST /api/v1/loans/{loan_id}/covenant-check` - Record covenant check

### Predictions
- `GET /api/v1/predictions/{loan_id}` - Get risk predictions (30/60/90 days)
- `GET /api/v1/predictions/{loan_id}/covenant/{covenant_id}` - Get covenant-specific prediction
- `GET /api/v1/predictions/{loan_id}/explainability` - Get prediction explanation

### ESG
- `GET /api/v1/esg/{loan_id}/score` - Get ESG score
- `GET /api/v1/esg/{loan_id}/compliance` - Get compliance summary
- `GET /api/v1/esg/{loan_id}/breach-risk` - Predict ESG breach risk
- `POST /api/v1/esg/{loan_id}/compliance-check` - Record ESG compliance check

### Audit
- `GET /api/v1/audit` - Get audit logs (with filters)
- `GET /api/v1/audit/{loan_id}/summary` - Get audit summary for loan
- `GET /api/v1/audit/events/types` - Get available event types

## Architecture

```
services/api/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── api/
│   │   └── routes/             # API route handlers
│   │       ├── loans.py
│   │       ├── predictions.py
│   │       ├── esg.py
│   │       └── audit.py
│   ├── services/               # Business logic services
│   │   ├── ingestion_service.py
│   │   ├── digital_twin_service.py
│   │   ├── prediction_service.py
│   │   ├── esg_service.py
│   │   └── audit_service.py
│   ├── ai/                     # AI/ML components
│   │   ├── feature_engineering.py
│   │   ├── risk_model.py
│   │   └── explainability.py
│   └── models/                 # Data models (imports from shared/)
└── requirements.txt
```

## Data Models

All data models are defined in `shared/models/`:
- `loan.py` - Loan, Covenant, ESGClause, LoanDocument
- `covenant.py` - CovenantCheck, CovenantStatus, CovenantType
- `esg.py` - ESGScore, ESGCompliance, ESGStatus, ESGCategory

## Development Notes

### Current Implementation Status

- ✅ Document ingestion (PDF/DOCX parsing)
- ✅ Digital twin creation and management
- ✅ AI risk prediction with explainability
- ✅ ESG scoring and compliance tracking
- ✅ Audit logging
- ✅ RESTful API endpoints

### Demo/Prototype Features

- In-memory storage (replace with database for production)
- Simulated ML model (replace with trained model for production)
- Basic document parsing (enhance with NLP/ML for production)
- Simple feature engineering (enhance for production)

### Integration Points

- **Frontend**: Electron desktop app connects via HTTP API
- **Blockchain**: Audit logs can be hashed and stored on blockchain (Lunga's work)
- **Shared Models**: Models are in `shared/models/` for cross-service use

## Testing

### Manual Testing

Use the interactive API docs at http://localhost:8000/docs to test endpoints.

### Example: Upload a Loan Document

```bash
curl -X POST "http://localhost:8000/api/v1/loans/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@loan_document.pdf"
```

### Example: Get Risk Predictions

```bash
curl "http://localhost:8000/api/v1/predictions/{loan_id}?horizons=30,60,90"
```

## Environment Variables

Currently, no environment variables are required. For production, consider:
- `API_PORT` - Server port (default: 8000)
- `LOG_LEVEL` - Logging level
- `DATABASE_URL` - Database connection string (when implemented)

## Next Steps

1. Add database persistence (SQLite for demo, PostgreSQL for production)
2. Enhance document parsing with NLP/ML models
3. Train actual ML model for risk prediction
4. Add authentication/authorization
5. Integrate with blockchain service (Lunga's work)
6. Add comprehensive error handling and validation
7. Add unit and integration tests

## Troubleshooting

### Import Errors

If you see import errors related to `shared/models`, ensure you're running from the project root or that the Python path includes the shared directory.

### Port Already in Use

If port 8000 is in use, specify a different port:
```bash
uvicorn app.main:app --reload --port 8001
```

### Missing Dependencies

If you encounter missing module errors, ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

