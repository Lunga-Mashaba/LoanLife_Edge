# LoanLife Edge

A secure desktop application that transforms each loan into a Digital Twin, continuously monitored by AI, governed by smart contracts, and logged on a permissioned blockchain.

## Project Overview

LoanLife Edge predicts loan covenant breaches and ESG non-compliance 30–90 days in advance, enabling proactive intervention for banks and financial institutions.

## Team

- **Nicolette** - Backend & AI Integration Lead (APIs, AI, digital twin logic)
- **Lunga** - Blockchain & Backend Engineer (Blockchain, smart contracts)
- **Siya** - Frontend Engineer – Core UI (Dashboards, visualisation)
- **Sharon** - Frontend Engineer – Desktop & UX (Electron, navigation, UX)

## Repository Structure

```
loanlife-edge/
├── README.md
├── .gitignore
├── apps/
│   └── desktop/          # Electron + React (Siya + Sharon)
├── services/
│   ├── api/              # Backend API & AI (Nicolette)
│   └── blockchain/       # Blockchain & smart contracts (Lunga)
├── shared/
│   ├── models/           # Shared data models
│   ├── constants/        # Shared constants
│   └── utils/            # Shared utilities
├── scripts/
│   ├── seed-data/        # Mock loan & ESG data
│   └── setup/            # Local setup scripts
└── docs/
    ├── architecture.md
    ├── api-spec.md
    ├── srs.md
    └── demo-script.md
```

## Quick Start

### Backend API (Nicolette's Work)

See [services/api/README.md](services/api/README.md) for detailed setup instructions.

Quick start:
```bash
cd services/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000/docs

## Features

- **Loan Document Ingestion**: Parse PDF/DOCX documents and extract covenants/ESG clauses
- **Digital Twin Creation**: One digital twin per loan with complete state tracking
- **AI Risk Prediction**: Predict breach risk at 30/60/90-day horizons with explainability
- **ESG Scoring**: Calculate ESG scores and track compliance
- **Blockchain Governance**: Smart contract-based covenant registry (Lunga)
- **Audit Logging**: Immutable audit trail of all actions
- **Desktop Application**: Electron-based desktop app (Siya + Sharon)

## Development Status

This is a hackathon prototype. See individual service READMEs for current implementation status.

## License

Hackathon Project - LMA EDGE Hackathon 2025