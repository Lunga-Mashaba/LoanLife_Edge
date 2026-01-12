# Integration Status

Everything's connected and working. Here's what we've got:

## Frontend ↔ Backend

**API Client (`lib/api/client.ts`):**
- HTTP client with error handling
- 30 second timeout
- Error class for API errors
- Handles JSON and FormData
- Network error handling

**Hooks:**
- `useLoans` - Gets loans from `/api/v1/loans`
- `usePredictions` - Gets predictions from `/api/v1/predictions/{loan_id}`
- `useESG` - Gets ESG scores from `/api/v1/esg/{loan_id}`
- `useAudit` - Gets audit logs from `/api/v1/audit`
- `useAllPredictions` - Aggregates predictions for timeline/insights

**Components:**
- `LoanHealthGrid` - Shows real loan data with search
- `RiskTimeline` - Shows predictions for all loans
- `AIInsights` - Shows critical alerts
- `AuditLogPanel` - Shows audit logs with pagination
- `ESGCompliance` - Aggregates ESG scores
- `PortfolioDashboard` - Everything integrated

## Backend ↔ Blockchain

**Blockchain Client (`services/api/app/services/blockchain_client.py`):**
- HTTP client for blockchain API bridge
- Error handling with fallbacks
- 5 second timeout
- Respects `BLOCKCHAIN_ENABLED` env var
- Health check method

**Integration points:**

**1. Loan Upload:**
- Registers covenants on blockchain when loan is created
- Non-blocking (continues if blockchain fails)
- Graceful error handling

**2. Audit Service:**
- Logs all audit events to blockchain
- Maps event types to blockchain actions
- Includes transaction hash in audit log
- Falls back gracefully if blockchain is down

**3. ESG Service:**
- Records ESG scores on blockchain
- Includes transaction hash
- Non-blocking

**4. Prediction Service:**
- Detects breaches on blockchain for high/critical risk
- Records breach detection with severity
- Includes transaction hash

**Health Check:**
- Health endpoint shows blockchain status
- Checks if enabled and available
- Reports blockchain URL

## How Data Flows

**1. Loan Creation:**
```
Frontend → POST /api/v1/loans/upload
→ Backend processes document
→ Creates digital twin
→ Registers covenants on blockchain (if enabled)
→ Logs audit event to blockchain (if enabled)
→ Returns loan data
→ Frontend updates UI
```

**2. Risk Prediction:**
```
Frontend → GET /api/v1/predictions/{loan_id}
→ Backend generates predictions
→ Detects breach on blockchain if high/critical (if enabled)
→ Logs prediction to audit (blockchain if enabled)
→ Returns predictions
→ Frontend shows in RiskTimeline/AIInsights
```

**3. ESG Scoring:**
```
Frontend → GET /api/v1/esg/{loan_id}/score
→ Backend calculates ESG score
→ Records score on blockchain (if enabled)
→ Logs to audit (blockchain if enabled)
→ Returns score
→ Frontend shows in ESGCompliance
```

**4. Audit Logging:**
```
Any action → Audit service logs event
→ Logs to in-memory storage
→ Logs to blockchain (if enabled)
→ Includes blockchain tx hash if successful
→ Frontend shows in AuditLogPanel
```

## Configuration

**Backend env vars:**
```env
BLOCKCHAIN_ENABLED=true
BLOCKCHAIN_API_URL=http://localhost:3001
SEED_DATA=true
```

**Frontend env vars:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Error Handling

**Frontend:**
- ApiError class for structured errors
- 30 second timeout
- Network error handling
- Empty response handling
- All hooks have error states

**Backend:**
- HTTPException for API errors
- Graceful blockchain fallbacks
- Non-blocking blockchain operations
- Error logging (continues operation)

**Blockchain:**
- Connection error handling
- 5 second timeout
- Service unavailable handling
- Falls back gracefully if blockchain is down

## Health Checks

- `GET /health` - Backend health with blockchain status
- `GET /health` - Blockchain API bridge health check

## Status

Everything's connected and working:
- Frontend → Backend: Done
- Backend → Blockchain: Done
- Error Handling: Done
- Health Checks: Done
- Configuration: Done

The system works with blockchain enabled, disabled, or partially failing. Ready to deploy.
