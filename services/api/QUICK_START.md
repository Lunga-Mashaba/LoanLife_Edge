# Quick Start Guide - Backend API

## What's Been Built

✅ **Complete Backend API Structure**
- FastAPI application with all core endpoints
- Document ingestion service (PDF/DOCX parsing)
- Digital twin service (loan state management)
- AI risk prediction service with explainability
- ESG scoring service
- Audit logging service

✅ **Data Models**
- Loan, Covenant, ESGClause models
- CovenantCheck, ESGCompliance models
- All models in `shared/models/` for cross-service use

✅ **API Endpoints**
- `/api/v1/loans/*` - Loan management
- `/api/v1/predictions/*` - Risk predictions
- `/api/v1/esg/*` - ESG scoring
- `/api/v1/audit/*` - Audit logs

## Getting Started (3 Steps)

1. **Install dependencies:**
```bash
cd services/api
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

2. **Run the server:**
```bash
python run.py
# OR
uvicorn app.main:app --reload
```

3. **Test it:**
- Open http://localhost:8000/docs
- Try the `/health` endpoint
- Upload a test document via `/api/v1/loans/upload`

## Key Files

- `app/main.py` - FastAPI app entry point
- `app/services/` - All business logic services
- `app/ai/` - AI/ML components (feature engineering, risk model, explainability)
- `app/api/routes/` - API route handlers

## Next Steps for Integration

1. **Frontend Integration (Siya/Sharon):**
   - API base URL: `http://localhost:8000`
   - All endpoints documented at `/docs`
   - CORS is enabled for Electron app

2. **Blockchain Integration (Lunga):**
   - Audit service ready for blockchain hashing
   - Covenant registry can be extended
   - See `audit_service.py` for integration points

3. **Testing:**
   - Use `/docs` for interactive testing
   - Create test loan documents (PDF/DOCX)
   - Test prediction endpoints with created loans

## Demo Flow

1. Upload a loan document → Creates digital twin
2. Get loan state → See health metrics
3. Get predictions → See 30/60/90 day risk forecasts
4. Get ESG score → See compliance breakdown
5. Check audit logs → See all actions

## Notes

- Currently uses in-memory storage (perfect for demo)
- ML model is simulated (works for prototype)
- Document parsing is basic (extracts key patterns)
- All ready for frontend integration!

