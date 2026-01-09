# LoanLife Edge

A secure desktop application that transforms each loan into a Digital Twin, continuously monitored by AI, governed by smart contracts, and logged on a permissioned blockchain.

## Project Overview

LoanLife Edge predicts loan covenant breaches and ESG non-compliance 30–90 days in advance, enabling proactive intervention for banks and financial institutions.

## Team

- **Nicolette** - Backend & AI Integration Lead (APIs, AI, digital twin logic) ✅ **Complete**
- **Lunga** - Blockchain & Backend Engineer (Blockchain, smart contracts) ✅ **Complete**
- **Siya** - Frontend Engineer – Core UI (Dashboards, visualisation) 🚧 **In Progress**
- **Sharon** - Frontend Engineer – Desktop & UX (Electron, navigation, UX) 🚧 **In Progress**

## Repository Structure

```
loanlife-edge/
├── README.md
├── .gitignore
├── apps/
│   └── desktop/          # Electron + React (Siya + Sharon)
├── services/
│   ├── api/              # Backend API & AI (Nicolette) ✅
│   └── blockchain/       # Blockchain & smart contracts (Lunga) ✅
├── shared/
│   ├── models/           # Shared data models
│   ├── constants/        # Shared constants
│   └── utils/            # Shared utilities
├── scripts/
│   ├── seed-data/        # Mock loan & ESG data
│   ├── start-all.sh      # Start all services (Linux/Mac)
│   └── start-all.ps1     # Start all services (Windows)
└── docs/
    ├── architecture.md
    ├── api-spec.md
    ├── srs.md
    └── demo-script.md
```

## Quick Start

### Option 1: Start All Services (Recommended)

**Windows:**
```powershell
.\scripts\start-all.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/start-all.sh
./scripts/start-all.sh
```

This will start:
1. Hardhat blockchain node (port 8545)
2. Blockchain API bridge (port 3001)
3. Backend API (port 8000)

### Option 2: Manual Setup

#### 1. Blockchain Services (Lunga's Work)

**Start Hardhat Node:**
```bash
cd services/blockchain
npm install
npx hardhat node
```

**Start Blockchain API Bridge** (in a new terminal):
```bash
cd services/blockchain/api
npm install
npm start
```

The blockchain API bridge will be available at http://localhost:3001

#### 2. Backend API (Nicolette's Work)

```bash
cd services/api
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# Set environment variables
# Windows PowerShell:
$env:SEED_DATA="true"
$env:BLOCKCHAIN_ENABLED="true"
$env:BLOCKCHAIN_API_URL="http://localhost:3001"
# Linux/Mac:
export SEED_DATA=true
export BLOCKCHAIN_ENABLED=true
export BLOCKCHAIN_API_URL=http://localhost:3001

# Start the API
uvicorn app.main:app --reload
```

API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## Features

### ✅ Implemented & Working

- **Loan Document Ingestion**: Parse PDF/DOCX documents and extract covenants/ESG clauses
- **Digital Twin Creation**: One digital twin per loan with complete state tracking
- **AI Risk Prediction**: Predict breach risk at 30/60/90-day horizons with explainability
- **ESG Scoring**: Calculate ESG scores and track compliance
- **Blockchain Governance**: Smart contract-based covenant registry with full integration
- **Audit Logging**: Immutable audit trail with blockchain hashing
- **Blockchain Integration**: Backend fully integrated with blockchain API bridge
  - Covenant registration on-chain
  - ESG score recording on-chain
  - Breach detection on-chain
  - Audit log hashing on-chain

### 🚧 In Progress

- **Desktop Application**: Electron-based desktop app (Siya + Sharon)
- **Frontend Dashboards**: Portfolio view, loan detail, risk visualization

## Implementation Status

### Backend & AI (Nicolette) - ✅ **100% Complete**

- ✅ FastAPI backend with all endpoints
- ✅ Document ingestion (PDF/DOCX parsing)
- ✅ Digital twin service
- ✅ AI risk prediction with explainability
- ✅ ESG scoring engine
- ✅ Audit logging service
- ✅ Blockchain client integration
- ✅ All SRS functional requirements met

### Blockchain & Smart Contracts (Lunga) - ✅ **100% Complete**

- ✅ Hardhat development environment
- ✅ Smart contracts (CovenantRegistry, GovernanceRules, ESGCompliance, AuditLedger)
- ✅ Blockchain API bridge (Node.js/Express)
- ✅ Full integration with backend API
- ✅ Covenant hashing and on-chain registration
- ✅ Governance rule engine
- ✅ Immutable audit ledger

### Frontend (Siya + Sharon) - 🚧 **In Progress**

- 🚧 Electron application setup
- 🚧 React components
- 🚧 Dashboard UI
- 🚧 API integration

## API Endpoints

### Loans
- `POST /api/v1/loans/upload` - Upload loan document
- `GET /api/v1/loans` - List all loans
- `GET /api/v1/loans/{loan_id}` - Get loan details
- `GET /api/v1/loans/{loan_id}/state` - Get digital twin state
- `POST /api/v1/loans/{loan_id}/covenant-check` - Record covenant check

### Predictions
- `GET /api/v1/predictions/{loan_id}` - Get risk predictions (30/60/90 days)
- `GET /api/v1/predictions/{loan_id}/covenant/{covenant_id}` - Covenant-specific prediction
- `GET /api/v1/predictions/{loan_id}/explainability` - Get prediction explanation

### ESG
- `GET /api/v1/esg/{loan_id}/score` - Get ESG score
- `GET /api/v1/esg/{loan_id}/compliance` - Get compliance summary
- `GET /api/v1/esg/{loan_id}/breach-risk` - Predict ESG breach risk
- `POST /api/v1/esg/{loan_id}/compliance-check` - Record ESG compliance check

### Audit
- `GET /api/v1/audit` - Get audit logs (with filters)
- `GET /api/v1/audit/{loan_id}/summary` - Get audit summary for loan

### Blockchain API Bridge
- `POST /api/v1/covenants/register` - Register covenant on blockchain
- `POST /api/v1/audit/log` - Log audit entry to blockchain
- `POST /api/v1/esg/record` - Record ESG score on blockchain
- `POST /api/v1/governance/detect-breach` - Detect breach on blockchain
- `GET /health` - Blockchain service health check

## Environment Variables

### Backend API
- `SEED_DATA` - Set to `"true"` to load demo data on startup
- `BLOCKCHAIN_ENABLED` - Set to `"true"` to enable blockchain integration
- `BLOCKCHAIN_API_URL` - Blockchain API bridge URL (default: `http://localhost:3001`)

### Blockchain
- `BLOCKCHAIN_RPC_URL` - Hardhat node RPC URL (default: `http://127.0.0.1:8545`)
- `BLOCKCHAIN_API_PORT` - Blockchain API bridge port (default: `3001`)

## Testing the Integration

1. **Start all services** using the startup scripts
2. **Check health endpoints:**
   - Backend: http://localhost:8000/health
   - Blockchain: http://localhost:3001/health
3. **Upload a loan document** via `/api/v1/loans/upload`
4. **Check blockchain integration:**
   - Covenant registration happens automatically
   - Audit logs include blockchain transaction hashes
   - ESG scores are recorded on-chain
5. **View predictions** via `/api/v1/predictions/{loan_id}`
6. **Check audit logs** via `/api/v1/audit`

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Electron Desktop App (Frontend)             │
│                    (Siya + Sharon)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP API
┌────────────────────▼────────────────────────────────────┐
│              Backend API (FastAPI)                      │
│                    (Nicolette)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Ingestion   │  │ Digital Twin │  │ AI Prediction│ │
│  │   Service    │  │   Service    │  │   Service    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ ESG Service  │  │Audit Service │  │ Blockchain   │ │
│  │              │  │              │  │   Client     │ │
│  └──────────────┘  └──────────────┘  └──────┬───────┘ │
└──────────────────────────────────────────────┼─────────┘
                                                │ HTTP
┌───────────────────────────────────────────────▼─────────┐
│         Blockchain API Bridge (Node.js/Express)         │
│                    (Lunga)                             │
└────────────────────┬───────────────────────────────────┘
                     │ Web3.js
┌────────────────────▼───────────────────────────────────┐
│         Hardhat Local Blockchain Node                  │
│         (Permissioned Blockchain Mock)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │  Covenant    │  │ Governance   │  │ Audit        ││
│  │  Registry    │  │   Rules      │  │ Ledger       ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
└────────────────────────────────────────────────────────┘
```

## Documentation

- [Backend API Documentation](services/api/README.md)
- [API Specification](docs/api-spec.md)
- [Architecture Overview](docs/architecture.md)
- [Software Requirements Specification](docs/srs.md)

## Development Notes

- **Storage**: Currently using in-memory storage for demo purposes. Replace with database for production.
- **ML Models**: Using simulated ML models for demo. Replace with trained models for production.
- **Blockchain**: Using Hardhat local node for demo. Replace with permissioned blockchain network for production.
- **Security**: CORS is open for hackathon demo. Restrict in production.

## License

Hackathon Project - LMA EDGE Hackathon 2025