# LoanLife Edge

A secure desktop application that transforms each loan into a Digital Twin, continuously monitored by AI, governed by smart contracts, and logged on a permissioned blockchain.

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFF1E2?style=for-the-badge&logo=ethereum&logoColor=333333)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Project Overview

LoanLife Edge predicts loan covenant breaches and ESG non-compliance 30–90 days in advance, enabling proactive intervention for banks and financial institutions.

## Team

- **Nicolette** - Backend & AI Integration Lead (APIs, AI, digital twin logic) ✅ **Complete**
- **Lunga** - Blockchain & Backend Engineer (Blockchain, smart contracts) ✅ **Complete**
- **Siya** - Frontend Engineer – Core UI (Dashboards, visualisation) ✅ **Complete**
- **Sharon** - Frontend Engineer – Desktop & UX (Electron, navigation, UX) ✅ **Complete**

## Repository Structure

```
LoanLife_Edge/
├── README.md
├── .gitignore
├── package.json          # Frontend dependencies (Next.js + Electron)
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Portfolio dashboard
│   ├── digital-twins/    # Digital twin monitor page
│   ├── risk-analytics/   # Risk analytics page
│   ├── audit-log/        # Audit log page
│   └── ...
├── components/           # React components
│   ├── portfolio-dashboard.tsx
│   ├── loan-health-grid.tsx
│   ├── audit-log-panel.tsx
│   ├── esg-compliance.tsx
│   └── ui/              # shadcn/ui components
├── lib/                  # Frontend utilities
│   ├── api/             # API client & hooks
│   │   ├── client.ts    # HTTP client
│   │   ├── loans.ts     # Loans API
│   │   ├── predictions.ts
│   │   ├── esg.ts
│   │   └── audit.ts
│   └── utils.ts
├── hooks/                # React hooks
│   ├── use-loans.ts
│   ├── use-predictions.ts
│   ├── use-audit.ts
│   └── use-esg.ts
├── services/
│   ├── api/              # Backend API & AI (Nicolette) ✅
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/routes/
│   │   │   └── services/
│   │   └── requirements.txt
│   └── blockchain/       # Blockchain & smart contracts (Lunga) ✅
│       ├── contracts/    # Solidity smart contracts
│       └── api/          # Blockchain API bridge (Node.js)
├── shared/
│   └── models/           # Shared data models (Python)
├── scripts/
│   ├── seed-data/        # Seed data scripts
│   ├── start-all.sh      # Start all services (Linux/Mac)
│   ├── start-all.ps1     # Start all services (Windows)
│   └── test_api.py       # API testing script
├── electron/             # Electron main process
└── docs/
    ├── architecture.md
    ├── api-spec.md
    ├── srs.md
    ├── frontend-backend-integration.md  # Integration guide
    └── ui-ux-review.md                  # UI/UX review & improvements
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

### Option 3: Frontend Application

**Start Frontend (Next.js + Electron):**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start with Electron
npm run electron:dev
```

Frontend will be available at:
- Web: http://localhost:3000
- Electron app launches automatically with `electron:dev`

**Note:** Make sure the backend API is running on port 8000 for the frontend to connect.

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

### ✅ Frontend & Integration - **Complete**

- **Desktop Application**: Electron-based desktop app (Next.js + Electron)
- **Frontend Dashboards**: Portfolio overview, loan health grid, risk timeline
- **API Integration**: Complete frontend-backend integration with React hooks
- **Real-time Updates**: Auto-refreshing components for live data
- **Component Library**: shadcn/ui components with custom styling

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

### Frontend (Siya + Sharon) - ✅ **100% Complete**

- ✅ Next.js application with App Router
- ✅ Electron desktop application setup
- ✅ React components (Portfolio, Digital Twins, Risk Analytics, Audit Log)
- ✅ Complete API integration with React hooks
- ✅ Real-time data fetching with auto-refresh
- ✅ Responsive UI components with shadcn/ui
- ✅ TypeScript type safety throughout

**Frontend Features:**
- Portfolio dashboard with loan health scores
- Digital twin monitoring with real-time state
- Risk analytics timeline
- ESG compliance tracking
- Audit log viewer with blockchain transaction hashes
- AI insights panel

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

### Frontend
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
The frontend defaults to `http://localhost:8000` if not specified.

### Blockchain
- `BLOCKCHAIN_RPC_URL` - Hardhat node RPC URL (default: `http://127.0.0.1:8545`)
- `BLOCKCHAIN_API_PORT` - Blockchain API bridge port (default: `3001`)

## Testing the Integration

### Backend & Blockchain

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

### Frontend Application

1. **Start backend services** (API + Blockchain) - see above
2. **Start frontend:**
   ```bash
   npm install
   npm run dev
   ```
3. **Open the application:**
   - Web: http://localhost:3000
   - Or Electron: `npm run electron:dev`
4. **Verify integration:**
   - Portfolio dashboard loads real loan data
   - Loan health scores display correctly
   - Audit logs show blockchain transaction hashes
   - ESG compliance aggregates across all loans
   - Risk timeline displays predictions

### API Testing Script

```bash
# Run the test script
cd scripts
python test_api.py
```

This will test all major API endpoints and verify the integration.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│        Electron Desktop App / Web App (Frontend)            │
│                   Next.js + React + Electron                │
│                      (Siya + Sharon) ✅                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React      │  │   API Client │  │   Hooks      │     │
│  │  Components  │  │   (lib/api)  │  │  (hooks/)    │     │
│  └──────────────┘  └──────┬───────┘  └──────────────┘     │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP/REST API
┌────────────────────────────▼────────────────────────────────┐
│              Backend API (FastAPI)                          │
│                    (Nicolette) ✅                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Ingestion   │  │ Digital Twin │  │ AI Prediction│     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ ESG Service  │  │Audit Service │  │ Blockchain   │     │
│  │              │  │              │  │   Client     │     │
│  └──────────────┘  └──────────────┘  └──────┬───────┘     │
└──────────────────────────────────────────────┼─────────────┘
                                                │ HTTP
┌───────────────────────────────────────────────▼─────────────┐
│         Blockchain API Bridge (Node.js/Express)            │
│                    (Lunga) ✅                               │
└────────────────────┬────────────────────────────────────────┘
                     │ Web3.js
┌────────────────────▼────────────────────────────────────────┐
│         Hardhat Local Blockchain Node                      │
│         (Permissioned Blockchain Mock)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Covenant    │  │ Governance   │  │ Audit        │    │
│  │  Registry    │  │   Rules      │  │ Ledger       │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### Key Integration Points

- **Frontend ↔ Backend**: RESTful API with TypeScript types
- **Backend ↔ Blockchain**: HTTP API bridge (Node.js/Express)
- **Data Flow**: Frontend hooks → API client → Backend → Blockchain
- **Real-time Updates**: Auto-refresh intervals (audit: 10s, predictions: 60s, states: 30s)

## Documentation

### Setup & Integration
- [Backend API Documentation](services/api/README.md)
- [Frontend-Backend Integration Guide](docs/frontend-backend-integration.md) - Complete integration documentation
- [UI/UX Review & Improvements](docs/ui-ux-review.md) - Principal engineer review with actionable improvements

### Specifications
- [API Specification](docs/api-spec.md)
- [Architecture Overview](docs/architecture.md)
- [Software Requirements Specification](docs/srs.md)

### Quick Links
- **API Client**: `lib/api/` - Centralized API client with TypeScript types
- **React Hooks**: `hooks/` - Custom hooks for data fetching (`useLoans`, `usePredictions`, `useAudit`, `useESG`)
- **Components**: `components/` - Reusable UI components

## Development Notes

### Current Implementation (Hackathon Demo)

- **Storage**: In-memory storage for demo. Replace with PostgreSQL/SQLite for production.
- **ML Models**: Simulated ML models for demo. Replace with trained models for production.
- **Blockchain**: Hardhat local node for demo. Replace with permissioned blockchain network for production.
- **Security**: CORS is open for hackathon demo. Implement proper authentication/authorization in production.
- **Frontend**: Complete API integration. See [UI/UX Review](docs/ui-ux-review.md) for recommended improvements.

### Known Limitations & Improvements

See [UI/UX Review Document](docs/ui-ux-review.md) for a comprehensive analysis including:
- Mobile responsiveness improvements needed
- Accessibility enhancements required
- Performance optimizations recommended
- Missing features (search, pagination, filtering)

### Production Readiness Checklist

- [ ] Database integration (PostgreSQL)
- [ ] Authentication & authorization
- [ ] Trained ML models
- [ ] Permissioned blockchain network
- [ ] Mobile-responsive design improvements
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Error monitoring & logging
- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] API rate limiting & security hardening

## License

Hackathon Project - LMA EDGE Hackathon 2025