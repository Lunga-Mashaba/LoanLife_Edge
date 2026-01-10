# Blockchain API Bridge

HTTP API bridge that exposes blockchain services to the Python backend.

## Setup

```bash
cd services/blockchain/api
npm install
```

## Running

**Start Hardhat node first** (in another terminal):
```bash
cd services/blockchain
npx hardhat node
```

**Then start the API bridge**:
```bash
cd services/blockchain/api
npm start
```

The API will run on `http://localhost:3001`

## Environment Variables

- `BLOCKCHAIN_API_PORT` - API port (default: 3001)
- `BLOCKCHAIN_RPC_URL` - Blockchain RPC URL (default: http://127.0.0.1:8545)

## Endpoints

- `POST /api/v1/covenants/register` - Register covenant
- `POST /api/v1/audit/log` - Log audit entry
- `POST /api/v1/esg/record` - Record ESG score
- `POST /api/v1/governance/detect-breach` - Detect breach
- `GET /api/v1/covenants/:loanId` - Get covenant
- `GET /api/v1/esg/:loanId` - Get ESG score
- `GET /health` - Health check

## Integration

The Python backend automatically uses this API if:
- `BLOCKCHAIN_ENABLED=true` (default: true)
- `BLOCKCHAIN_API_URL=http://localhost:3001` (default)

If blockchain service is unavailable, backend continues with graceful degradation.

