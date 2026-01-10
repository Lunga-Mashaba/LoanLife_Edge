/**
 * Blockchain HTTP API Bridge
 * Exposes blockchain services via REST API for Python backend integration
 */
import express from 'express';
import cors from 'cors';
// Import with error handling for TypeScript compilation issues
let BlockchainService: any;
let Logger: any;

try {
  const blockchainModule = require('../src/services/BlockchainServices');
  BlockchainService = blockchainModule.BlockchainService;
  const loggerModule = require('../src/utils/Logger');
  Logger = loggerModule.Logger;
} catch (error) {
  // Fallback logger if imports fail
  Logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    success: (msg: string) => console.log(`✅ ${msg}`)
  };
}

const app = express();
const PORT = process.env.BLOCKCHAIN_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize blockchain service
let blockchainService: BlockchainService | null = null;

async function initializeBlockchain() {
  try {
    if (!BlockchainService) {
      Logger.warn('BlockchainService not available - running in demo mode');
      return false;
    }

    // Use local Hardhat network for demo
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
    
    blockchainService = new BlockchainService({
      rpcUrl: rpcUrl,
      chainId: 1337,
      gasLimit: 3000000,
      contracts: {
        covenantRegistry: { address: '', abi: [] },
        governanceRules: { address: '', abi: [] },
        auditLedger: { address: '', abi: [] },
        esgCompliance: { address: '', abi: [] }
      }
    });
    
    const initialized = await blockchainService.initialize();
    
    if (!initialized) {
      Logger.warn('Blockchain service not initialized - running in demo mode');
      return false;
    }
    
    Logger.success('Blockchain service initialized');
    return true;
  } catch (error: any) {
    Logger.warn(`Blockchain initialization error: ${error.message} - running in demo mode`);
    return false;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: blockchainService ? 'ready' : 'initializing',
    service: 'Blockchain API Bridge',
    version: '1.0.0'
  });
});

// Register covenant on blockchain
app.post('/api/v1/covenants/register', async (req, res) => {
  try {
    if (!blockchainService) {
      return res.status(503).json({ error: 'Blockchain service not initialized' });
    }

    const { loanId, covenantData } = req.body;
    
    if (!loanId || !covenantData) {
      return res.status(400).json({ error: 'loanId and covenantData required' });
    }

    const result = await blockchainService.registerCovenant(loanId, covenantData);
    
    if (result.success) {
      res.json({
        success: true,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        covenantHash: result.data?.covenantHash
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error: any) {
    Logger.error(`Error registering covenant: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Log audit entry to blockchain
app.post('/api/v1/audit/log', async (req, res) => {
  try {
    if (!blockchainService) {
      return res.status(503).json({ error: 'Blockchain service not initialized' });
    }

    const { actionType, loanId, actor, dataHash, metadata } = req.body;
    
    if (!actionType || !loanId || !actor) {
      return res.status(400).json({ error: 'actionType, loanId, and actor required' });
    }

    // Access internal contract and wallet
    const service = blockchainService as any;
    if (!service.auditLedger || !service.walletAddress) {
      return res.status(503).json({ error: 'Blockchain contracts not loaded' });
    }

    const tx = await service.auditLedger.methods
      .logAction(
        parseInt(actionType),
        loanId,
        dataHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        dataHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        metadata || JSON.stringify({})
      )
      .send({ 
        from: service.walletAddress, 
        gas: 300000 
      });
    
    res.json({
      success: true,
      transactionHash: tx.transactionHash,
      blockNumber: tx.blockNumber
    });
  } catch (error: any) {
    Logger.error(`Error logging audit entry: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Record ESG score on blockchain
app.post('/api/v1/esg/record', async (req, res) => {
  try {
    if (!blockchainService) {
      return res.status(503).json({ error: 'Blockchain service not initialized' });
    }

    const { loanId, environmental, social, governance, evidenceHash } = req.body;
    
    if (!loanId || environmental === undefined || social === undefined || governance === undefined) {
      return res.status(400).json({ error: 'loanId, environmental, social, and governance required' });
    }

    const result = await blockchainService.recordESGScore(
      loanId,
      environmental,
      social,
      governance,
      evidenceHash || '0x0000000000000000000000000000000000000000000000000000000000000000'
    );
    
    if (result.success) {
      res.json({
        success: true,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error: any) {
    Logger.error(`Error recording ESG score: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Detect breach on blockchain
app.post('/api/v1/governance/detect-breach', async (req, res) => {
  try {
    if (!blockchainService) {
      return res.status(503).json({ error: 'Blockchain service not initialized' });
    }

    const { breachId, loanId, ruleId, severity, predictedValue } = req.body;
    
    if (!breachId || !loanId || !ruleId || !severity) {
      return res.status(400).json({ error: 'breachId, loanId, ruleId, and severity required' });
    }

    const result = await blockchainService.detectBreach({
      breachId,
      loanId,
      ruleId,
      severity: parseInt(severity),
      predictedValue: predictedValue || 0
    });
    
    if (result.success) {
      res.json({
        success: true,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error: any) {
    Logger.error(`Error detecting breach: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get covenant from blockchain
app.get('/api/v1/covenants/:loanId', async (req, res) => {
  try {
    if (!blockchainService) {
      return res.status(503).json({ error: 'Blockchain service not initialized' });
    }

    const { loanId } = req.params;
    const covenant = await blockchainService.getCovenant(loanId);
    
    if (covenant) {
      res.json(covenant);
    } else {
      res.status(404).json({ error: 'Covenant not found' });
    }
  } catch (error: any) {
    Logger.error(`Error getting covenant: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get ESG score from blockchain
app.get('/api/v1/esg/:loanId', async (req, res) => {
  try {
    if (!blockchainService) {
      return res.status(503).json({ error: 'Blockchain service not initialized' });
    }

    const { loanId } = req.params;
    const score = await blockchainService.getCurrentESGScore(loanId);
    
    if (score) {
      res.json(score);
    } else {
      res.status(404).json({ error: 'ESG score not found' });
    }
  } catch (error: any) {
    Logger.error(`Error getting ESG score: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  const initialized = await initializeBlockchain();
  
  if (!initialized) {
    Logger.warn('Starting server without blockchain connection (demo mode)');
  }
  
  app.listen(PORT, () => {
    Logger.info(`Blockchain API Bridge running on http://localhost:${PORT}`);
    Logger.info('Endpoints:');
    Logger.info('  POST /api/v1/covenants/register');
    Logger.info('  POST /api/v1/audit/log');
    Logger.info('  POST /api/v1/esg/record');
    Logger.info('  POST /api/v1/governance/detect-breach');
    Logger.info('  GET  /api/v1/covenants/:loanId');
    Logger.info('  GET  /api/v1/esg/:loanId');
  });
}

startServer().catch(console.error);

