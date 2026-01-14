#!/bin/bash
# Start all services for LoanLife Edge
# Run this script to start backend API, blockchain node, and blockchain API bridge

echo "🚀 Starting LoanLife Edge Services..."

# Start blockchain node in background
echo "📦 Starting blockchain node..."
cd services/blockchain
npx hardhat node > blockchain-node.log 2>&1 &
BLOCKCHAIN_NODE_PID=$!
echo "Blockchain node PID: $BLOCKCHAIN_NODE_PID"
sleep 5

# Start blockchain API bridge in background
echo "🌐 Starting blockchain API bridge..."
cd api
npm install > /dev/null 2>&1
npm start > blockchain-api.log 2>&1 &
BLOCKCHAIN_API_PID=$!
echo "Blockchain API PID: $BLOCKCHAIN_API_PID"
sleep 3

# Start backend API
echo "🔧 Starting backend API..."
cd ../../services/api
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate
export SEED_DATA=true
export BLOCKCHAIN_ENABLED=true
export BLOCKCHAIN_API_URL=http://localhost:3001
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Cleanup on exit
trap "kill $BLOCKCHAIN_NODE_PID $BLOCKCHAIN_API_PID 2>/dev/null" EXIT

