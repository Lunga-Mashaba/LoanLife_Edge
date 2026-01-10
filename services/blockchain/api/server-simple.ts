/**
 * Simplified Blockchain HTTP API Bridge
 * Works even if BlockchainServices has TypeScript compilation issues
 */
import express from 'express';
import cors from 'cors';
import Web3 from 'web3';

const app = express();
const PORT = process.env.BLOCKCHAIN_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Fix BigInt serialization for JSON responses
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

// Initialize Web3 connection
let web3: Web3 | null = null;
let walletAddress: string | null = null;
let isConnected = false;

async function initializeWeb3() {
  try {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
    web3 = new Web3(rpcUrl);
    
    // Get first account
    const accounts = await web3.eth.getAccounts();
    walletAddress = accounts[0] || null;
    
    if (!walletAddress) {
      console.warn('⚠️  No accounts available - running in demo mode');
      return false;
    }
    
    const networkId = await web3.eth.net.getId();
    console.log(`✅ Connected to blockchain network: ${networkId}`);
    console.log(`✅ Using account: ${walletAddress}`);
    
    isConnected = true;
    return true;
  } catch (error: any) {
    console.warn(`⚠️  Blockchain connection error: ${error.message} - running in demo mode`);
    return false;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: isConnected ? 'ready' : 'demo_mode',
    service: 'Blockchain API Bridge',
    version: '1.0.0',
    connected: isConnected
  });
});

// Register covenant on blockchain
app.post('/api/v1/covenants/register', async (req, res) => {
  try {
    if (!isConnected || !web3 || !walletAddress) {
      return res.json({
        success: false,
        error: 'Blockchain not connected - demo mode',
        fallback: true
      });
    }

    const { loanId, covenantData } = req.body;
    
    if (!loanId || !covenantData) {
      return res.status(400).json({ error: 'loanId and covenantData required' });
    }

    // For demo: return success without actual blockchain transaction
    // In production, this would call the actual contract
    const blockNumber = await web3.eth.getBlockNumber();
    res.json({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Number(blockNumber),
      covenantHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      demo: true
    });
  } catch (error: any) {
    console.error(`Error registering covenant: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Log audit entry to blockchain
app.post('/api/v1/audit/log', async (req, res) => {
  try {
    if (!isConnected || !web3 || !walletAddress) {
      return res.json({
        success: false,
        error: 'Blockchain not connected - demo mode',
        fallback: true
      });
    }

    const { actionType, loanId, actor, dataHash, metadata } = req.body;
    
    if (!actionType || !loanId || !actor) {
      return res.status(400).json({ error: 'actionType, loanId, and actor required' });
    }

    // For demo: return success without actual blockchain transaction
    const blockNumber = await web3.eth.getBlockNumber();
    res.json({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Number(blockNumber),
      demo: true
    });
  } catch (error: any) {
    console.error(`Error logging audit entry: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Record ESG score on blockchain
app.post('/api/v1/esg/record', async (req, res) => {
  try {
    if (!isConnected || !web3 || !walletAddress) {
      return res.json({
        success: false,
        error: 'Blockchain not connected - demo mode',
        fallback: true
      });
    }

    const { loanId, environmental, social, governance, evidenceHash } = req.body;
    
    if (!loanId || environmental === undefined || social === undefined || governance === undefined) {
      return res.status(400).json({ error: 'loanId, environmental, social, and governance required' });
    }

    // For demo: return success without actual blockchain transaction
    const blockNumber = await web3.eth.getBlockNumber();
    res.json({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Number(blockNumber),
      demo: true
    });
  } catch (error: any) {
    console.error(`Error recording ESG score: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Detect breach on blockchain
app.post('/api/v1/governance/detect-breach', async (req, res) => {
  try {
    if (!isConnected || !web3 || !walletAddress) {
      return res.json({
        success: false,
        error: 'Blockchain not connected - demo mode',
        fallback: true
      });
    }

    const { breachId, loanId, ruleId, severity, predictedValue } = req.body;
    
    if (!breachId || !loanId || !ruleId || !severity) {
      return res.status(400).json({ error: 'breachId, loanId, ruleId, and severity required' });
    }

    // For demo: return success without actual blockchain transaction
    const blockNumber = await web3.eth.getBlockNumber();
    res.json({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Number(blockNumber),
      demo: true
    });
  } catch (error: any) {
    console.error(`Error detecting breach: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get covenant from blockchain
app.get('/api/v1/covenants/:loanId', async (req, res) => {
  try {
    if (!isConnected || !web3) {
      return res.status(404).json({ error: 'Blockchain not connected' });
    }

    const { loanId } = req.params;
    // For demo: return not found
    res.status(404).json({ error: 'Covenant not found' });
  } catch (error: any) {
    console.error(`Error getting covenant: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get ESG score from blockchain
app.get('/api/v1/esg/:loanId', async (req, res) => {
  try {
    if (!isConnected || !web3) {
      return res.status(404).json({ error: 'Blockchain not connected' });
    }

    const { loanId } = req.params;
    // For demo: return not found
    res.status(404).json({ error: 'ESG score not found' });
  } catch (error: any) {
    console.error(`Error getting ESG score: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  const initialized = await initializeWeb3();
  
  if (!initialized) {
    console.warn('⚠️  Starting server in demo mode (blockchain not connected)');
  }
  
  app.listen(PORT, () => {
    console.log(`\n🌐 Blockchain API Bridge running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('  POST /api/v1/covenants/register');
    console.log('  POST /api/v1/audit/log');
    console.log('  POST /api/v1/esg/record');
    console.log('  POST /api/v1/governance/detect-breach');
    console.log('  GET  /api/v1/covenants/:loanId');
    console.log('  GET  /api/v1/esg/:loanId');
    console.log('  GET  /health\n');
  });
}

startServer().catch(console.error);

