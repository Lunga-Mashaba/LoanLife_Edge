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
    import traceback
    from pathlib import Path
    
    try:
        # Add project root and API directory to path
        project_root = Path(__file__).parent.parent.parent.parent
        api_path = project_root / "services" / "api"
        scripts_path = project_root / "scripts" / "seed-data"
        
        # Add both paths to sys.path
        sys.path.insert(0, str(api_path))
        sys.path.insert(0, str(scripts_path))
        
        print(f"🌱 Seeding demo data...")
        print(f"   Project root: {project_root}")
        print(f"   API path: {api_path}")
        print(f"   Scripts path: {scripts_path}")
        
        # Import and run seed function
        from seed_loans import create_sample_loans
        create_sample_loans()
        print("✅ Demo data seeded successfully!")
    except ImportError as e:
        print(f"⚠️  Failed to import seed script: {e}")
        print(f"   sys.path: {sys.path}")
        traceback.print_exc()
    except Exception as e:
        print(f"⚠️  Failed to seed data: {e}")
        traceback.print_exc()


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
    # Check blockchain status if enabled
    blockchain_status = "disabled"
    blockchain_available = False
    if os.getenv("BLOCKCHAIN_ENABLED", "false").lower() == "true":
        try:
            from app.services.blockchain_client import get_blockchain_client
            blockchain_client = get_blockchain_client()
            blockchain_available = blockchain_client.is_available()
            blockchain_status = "available" if blockchain_available else "unavailable"
        except Exception:
            blockchain_status = "error"
    
    return {
        "status": "healthy",
        "service": "LoanLife Edge API",
        "version": "1.0.0",
        "components": {
            "api": "operational",
            "digital_twin": "operational",
            "ai_prediction": "operational",
            "esg_scoring": "operational",
            "blockchain": blockchain_status
        },
        "blockchain": {
            "enabled": os.getenv("BLOCKCHAIN_ENABLED", "false").lower() == "true",
            "available": blockchain_available,
            "url": os.getenv("BLOCKCHAIN_API_URL", "http://localhost:3001")
        }
    }

