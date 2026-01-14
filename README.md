# LoanLife Edge

A secure desktop application that transforms each loan into a Digital Twin, continuously monitored by AI, governed by smart contracts, and logged on a permissioned blockchain.

**TechBridle Team**

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

## What This Is

We built a loan monitoring system that predicts when loans might breach covenants or fail ESG requirements - basically giving banks a heads up 30-90 days before things go wrong. Think of it like a health monitor for loans, but with AI and blockchain thrown in.

## Team (TechBridle Team)

- **Nicolette** - Backend & AI Integration Lead (APIs, AI, digital twin logic) ✅ **Complete**
- **Lunga** - Blockchain & Backend Engineer (Blockchain, smart contracts) ✅ **Complete**
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

## Getting Started

### Running Locally

**Quick Start (Windows):**
```powershell
.\scripts\start-all.ps1
```

**Quick Start (Mac/Linux):**
```bash
chmod +x scripts/start-all.sh
./scripts/start-all.sh
```

This starts:
- Blockchain node (port 8545)
- Blockchain API bridge (port 3001)  
- Backend API (port 8000)

Then start the frontend:
```bash
npm install
npm run dev
```

Open http://localhost:3000

**See [Quick Start Guide](docs/QUICK_START.md) for detailed steps.**

### Deploying to Free Platforms

**Backend → Render:**
1. Go to render.com, sign up with GitHub
2. New Web Service → Connect repo
3. Root Directory: `services/api`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add env vars: `SEED_DATA=false`, `BLOCKCHAIN_ENABLED=false`

**Frontend → Vercel:**
1. Go to vercel.com, sign up with GitHub
2. New Project → Import repo
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy

**See [Quick Start Guide](docs/QUICK_START.md) for complete deployment steps.**

## What We Built

**Backend stuff:**
- Upload a loan document (PDF/DOCX) and it extracts covenants and ESG stuff automatically
- Each loan gets a "digital twin" that tracks its health in real-time
- AI predicts if a loan will breach covenants 30/60/90 days ahead
- ESG scoring that actually makes sense
- Everything gets logged to blockchain (immutable audit trail)
- Smart contracts handle covenant rules

**Frontend stuff:**
- Desktop app (Electron) + web version
- Dashboard shows all loans with health scores
- Risk timeline shows what's coming up
- ESG compliance tracker
- Audit log with blockchain transaction hashes
- Everything auto-refreshes so you see updates live

## Status

Everything's working. Here's what each person built:

**Nicolette (Backend):** All API endpoints working, document parsing works, AI predictions running, blockchain integration is solid.

**Lunga (Blockchain):** Smart contracts deployed, API bridge working, everything integrated with the backend. You can see blockchain transaction hashes in the audit logs.

**Sharon (Frontend):** Full Next.js app, Electron desktop version, all components connected to real APIs, real-time updates working, looks good.

We hit all the requirements. The whole thing works end-to-end.

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
│                         (Sharon) ✅                          │
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

## Things to Know

This is a hackathon demo, so keep in mind:
- Data is stored in memory (restart = data gone). Real use would need PostgreSQL.
- The AI models are simulated. Production would need actual trained models.
- Blockchain runs locally on Hardhat. Production would use a real permissioned network.
- CORS is wide open. Production needs proper auth.
- Mobile UI could be better (we focused on desktop).

**For production we'd:**
- Add a real database
- Implement proper authentication
- Train actual ML models
- Use a production blockchain network
- Make it fully mobile-responsive
- Add comprehensive tests
- Set up monitoring/logging

But for a hackathon demo, this works great.

## License

Hackathon Project - LMA EDGE Hackathon 2025