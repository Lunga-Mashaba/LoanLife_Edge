"""
LoanLife Edge API - main FastAPI app
Backend for digital twin loan monitoring system
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import loans, predictions, esg, audit

app = FastAPI(
    title="LoanLife Edge API",
    description="Backend API for LoanLife Edge - Digital Twin Loan Monitoring System",
    version="1.0.0"
)

# CORS for Electron app - allow all for hackathon, restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to Electron app origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(loans.router, prefix="/api/v1", tags=["loans"])
app.include_router(predictions.router, prefix="/api/v1", tags=["predictions"])
app.include_router(esg.router, prefix="/api/v1", tags=["esg"])
app.include_router(audit.router, prefix="/api/v1", tags=["audit"])

# Seed demo data if requested (for hackathon demo)
if os.getenv("SEED_DATA", "false").lower() == "true":
    import sys
    from pathlib import Path
    
    # Add scripts to path
    project_root = Path(__file__).parent.parent.parent.parent
    scripts_path = project_root / "scripts" / "seed-data"
    sys.path.insert(0, str(scripts_path))
    
    try:
        from seed_loans import create_sample_loans
        print("🌱 Seeding demo data...")
        create_sample_loans()
        print("✅ Demo data seeded successfully!")
    except Exception as e:
        print(f"⚠️  Failed to seed data: {e}")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "LoanLife Edge API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "LoanLife Edge API",
        "version": "1.0.0",
        "components": {
            "api": "operational",
            "digital_twin": "operational",
            "ai_prediction": "operational",
            "esg_scoring": "operational"
        }
    }

