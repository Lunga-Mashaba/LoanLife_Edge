import Web3 from 'web3';
import { AbiFragment } from 'web3-eth-abi';
import { Contract } from 'web3-eth-contract';
import { 
  Covenant, 
  GovernanceRule, 
  Breach, 
  Severity, 
  AuditEntry,
  ESGScore 
} from '../types/contracts';
import { Hasher } from '../utils/Hasher';
import { Logger } from '../utils/Logger';
import config from '../config/blockchainConfig';

export interface BlockchainConfig {
  rpcUrl: string;
  chainId: number;
  gasLimit: number;
  contracts: {
    covenantRegistry: {
      address: string;
      abi: AbiFragment[];
    };
    governanceRules: {
      address: string;
      abi: AbiFragment[];
    };
    auditLedger: {
      address: string;
      abi: AbiFragment[];
    };
    esgCompliance: {
      address: string;
      abi: AbiFragment[];
    };
  };
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  error?: string;
  data?: any;
}

export class BlockchainService {
  private web3: Web3;
  private covenantRegistry: Contract<any> | null = null;
  private governanceRules: Contract<any> | null = null;
  private auditLedger: Contract<any> | null = null;
  private esgCompliance: Contract<any> | null = null;
  private isConnected: boolean = false;
  private walletAddress: string | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(customConfig?: Partial<BlockchainConfig>) {
    const finalConfig = { ...config, ...customConfig };
    this.web3 = new Web3(finalConfig.rpcUrl);
  }

  /**
   * Initialize blockchain connection and load contracts
   */
  async initialize(privateKey?: string): Promise<boolean> {
    try {
      Logger.info('Initializing blockchain service...');

      // Set up wallet if private key provided
      if (privateKey) {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.web3.eth.accounts.wallet.add(account);
        this.web3.eth.defaultAccount = account.address;
        this.walletAddress = account.address;
      } else {
        // Get first account from provider
        const accounts = await this.web3.eth.getAccounts();
        this.walletAddress = accounts[0] || null;
      }

      if (!this.walletAddress) {
        throw new Error('No wallet address available');
      }

      // Check connection
      const networkId = await this.web3.eth.net.getId();
      Logger.info(`Connected to network: ${networkId}`);
      Logger.info(`Using account: ${this.walletAddress}`);

      // Load contracts
      await this.loadContracts();

      // Set up event listeners
      this.setupEventListeners();

      this.isConnected = true;
      Logger.success('Blockchain service initialized successfully');
      
      return true;

    } catch (error: any) {
      Logger.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  /**
   * Load smart contracts
   */
  private async loadContracts(): Promise<void> {
    try {
      // Use the merged config from the constructor
      const contractsConfig = (this.web3 as any)._provider?.contractsConfig || config.contracts;

      // Load CovenantRegistry
      this.covenantRegistry = new this.web3.eth.Contract(
        contractsConfig.covenantRegistry.abi as AbiFragment[],
        contractsConfig.covenantRegistry.address
      );
      Logger.info('CovenantRegistry contract loaded');

      // Load GovernanceRules
      this.governanceRules = new this.web3.eth.Contract(
        contractsConfig.governanceRules.abi as AbiFragment[],
        contractsConfig.governanceRules.address
      );
      Logger.info('GovernanceRules contract loaded');

      // Load AuditLedger
      this.auditLedger = new this.web3.eth.Contract(
        contractsConfig.auditLedger.abi as AbiFragment[],
        contractsConfig.auditLedger.address
      );
      Logger.info('AuditLedger contract loaded');

      // Load ESGCompliance
      this.esgCompliance = new this.web3.eth.Contract(
        contractsConfig.esgCompliance.abi as AbiFragment[],
        contractsConfig.esgCompliance.address
      );
      Logger.info('ESGCompliance contract loaded');

    } catch (error: any) {
      Logger.error('Failed to load contracts:', error);
      throw error;
    }
  }

  /**
   * Register a covenant on blockchain
   */
  async registerCovenant(
    loanId: string,
    covenantData: any,
    covenantType: string = 'FINANCIAL'
  ): Promise<TransactionResult> {
    try {
      if (!this.covenantRegistry || !this.walletAddress) {
        throw new Error('Blockchain not initialized');
      }

      // Generate hash of covenant data
      const covenantHash = Hasher.generateCovenantHash(covenantData);
      Logger.info(`Generated covenant hash for ${loanId}: ${covenantHash}`);

      // Estimate gas
      const gasEstimate = await this.covenantRegistry.methods
        .registerCovenant(loanId, covenantHash, covenantType)
        .estimateGas({ from: this.walletAddress });

      // Send transaction
      const tx = await this.covenantRegistry.methods
        .registerCovenant(loanId, covenantHash, covenantType)
        .send({
          from: this.walletAddress,
          gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer
          gasPrice: await this.web3.eth.getGasPrice(),
        });

      Logger.info(`Covenant registered: ${loanId}, TX: ${tx.transactionHash}`);

      // Log to audit ledger
      if (this.auditLedger) {
        await this.auditLedger.methods
          .logAction(
            0, // COVENANT_REGISTERED
            loanId,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            covenantHash,
            JSON.stringify({ covenantType, timestamp: new Date().toISOString() })
          )
          .send({ from: this.walletAddress, gas: config.gasLimit });
      }

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: Number(tx.blockNumber),
        data: { covenantHash }
      };

    } catch (error: any) {
      Logger.error('Error registering covenant:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get covenant details from blockchain
   */
  async getCovenant(loanId: string): Promise<Covenant | null> {
    try {
      if (!this.covenantRegistry) {
        throw new Error('CovenantRegistry contract not loaded');
      }

      const result: any = await this.covenantRegistry.methods.getCovenant(loanId).call();

      // Check if covenant exists (timestamp > 0)
      if (parseInt(result.timestamp) === 0) {
        return null;
      }

      return {
        hash: result.hash,
        timestamp: parseInt(result.timestamp),
        registeredBy: result.registeredBy,
        loanId: result.loanId,
        covenantType: result.covenantType,
      };

    } catch (error) {
      Logger.error('Error getting covenant:', error);
      throw error;
    }
  }

  /**
   * Verify covenant integrity
   */
  async verifyCovenant(loanId: string, covenantData: any): Promise<boolean> {
    try {
      if (!this.covenantRegistry) {
        throw new Error('CovenantRegistry contract not loaded');
      }

      const covenantHash = Hasher.generateCovenantHash(covenantData);
      const result = await this.covenantRegistry.methods
        .verifyCovenant(loanId, covenantHash)
        .call();

      // Ensure the result is a boolean
      return Boolean(result);

    } catch (error) {
      Logger.error('Error verifying covenant:', error);
      throw error;
    }
  }

  /**
   * Create a new governance rule
   */
  async createRule(ruleData: {
    ruleId: string;
    covenantType: string;
    threshold: number;
    approvers: string[];
    gracePeriod: number;
  }): Promise<TransactionResult> {
    try {
      if (!this.governanceRules || !this.walletAddress) {
        throw new Error('Blockchain not initialized');
      }

      const tx = await this.governanceRules.methods
        .createRule(
          ruleData.ruleId,
          ruleData.covenantType,
          ruleData.threshold,
          ruleData.approvers,
          ruleData.gracePeriod
        )
        .send({
          from: this.walletAddress,
          gas: config.gasLimit,
        });

      Logger.info(`Rule created: ${ruleData.ruleId}, TX: ${tx.transactionHash}`);

      // Log to audit ledger
      if (this.auditLedger) {
        await this.auditLedger.methods
          .logAction(
            3, // RULE_CREATED
            ruleData.ruleId,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            this.web3.utils.keccak256(ruleData.ruleId),
            JSON.stringify(ruleData)
          )
          .send({ from: this.walletAddress, gas: config.gasLimit });
      }

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
      };

    } catch (error: any) {
      Logger.error('Error creating rule:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Detect a breach using GovernanceRules contract
   */
  async detectBreach(breachData: {
    breachId: string;
    loanId: string;
    ruleId: string;
    severity: Severity;
    predictedValue: number;
  }): Promise<TransactionResult> {
    try {
      if (!this.governanceRules || !this.walletAddress) {
        throw new Error('Blockchain not initialized');
      }

      const { breachId, loanId, ruleId, severity, predictedValue } = breachData;

      // Send transaction
      const tx = await this.governanceRules.methods
        .detectBreach(breachId, loanId, ruleId, severity, predictedValue)
        .send({
          from: this.walletAddress,
          gas: config.gasLimit,
          gasPrice: await this.web3.eth.getGasPrice(),
        });

      Logger.info(`Breach detected: ${breachId}, TX: ${tx.transactionHash}`);

      // Log to audit ledger
      if (this.auditLedger) {
        await this.auditLedger.methods
          .logAction(
            5, // BREACH_DETECTED
            breachId,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            this.web3.utils.keccak256(breachId),
            JSON.stringify(breachData)
          )
          .send({ from: this.walletAddress, gas: config.gasLimit });
      }

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
      };

    } catch (error: any) {
      Logger.error('Error detecting breach:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update breach status
   */
  async updateBreachStatus(
    breachId: string,
    status: number,
    reason: string
  ): Promise<TransactionResult> {
    try {
      if (!this.governanceRules || !this.walletAddress) {
        throw new Error('Blockchain not initialized');
      }

      const tx = await this.governanceRules.methods
        .updateBreachStatus(breachId, status, reason)
        .send({
          from: this.walletAddress,
          gas: config.gasLimit,
        });

      Logger.info(`Breach status updated: ${breachId}, TX: ${tx.transactionHash}`);

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
      };

    } catch (error: any) {
      Logger.error('Error updating breach status:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Record ESG score
   */
  async recordESGScore(
    loanId: string,
    environmental: number,
    social: number,
    governance: number,
    evidenceHash: string
  ): Promise<TransactionResult> {
    try {
      if (!this.esgCompliance || !this.walletAddress) {
        throw new Error('Blockchain not initialized');
      }

      const tx = await this.esgCompliance.methods
        .recordESGScore(loanId, environmental, social, governance, evidenceHash)
        .send({
          from: this.walletAddress,
          gas: config.gasLimit,
        });

      Logger.info(`ESG score recorded for ${loanId}, TX: ${tx.transactionHash}`);

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
      };

    } catch (error: any) {
      Logger.error('Error recording ESG score:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get current ESG score
   */
  async getCurrentESGScore(loanId: string): Promise<ESGScore | null> {
    try {
      if (!this.esgCompliance) {
        throw new Error('ESGCompliance contract not loaded');
      }

      const result = await this.esgCompliance.methods.getCurrentESGScore(loanId).call() as {
        environmental: string;
        social: string;
        governance: string;
        timestamp: string;
        scoredBy: string;
        evidenceHash: string;
      };

      if (!result || result.timestamp === '0') {
        return null;
      }

      return {
        environmental: parseInt(result.environmental),
        social: parseInt(result.social),
        governance: parseInt(result.governance),
        timestamp: parseInt(result.timestamp),
        scoredBy: result.scoredBy,
        evidenceHash: result.evidenceHash,
      };

    } catch (error) {
      Logger.error('Error getting ESG score:', error);
      throw error;
    }
  }

  /**
   * Get breach details
   */
  async getBreach(breachId: string): Promise<Breach | null> {
    try {
      if (!this.governanceRules) {
        throw new Error('GovernanceRules contract not loaded');
      }

      const result = await this.governanceRules.methods.getBreach(breachId).call() as {
        breachId: string;
        loanId: string;
        ruleId: string;
        severity: string;
        status: string;
        detectedAt: string;
        resolvedAt: string;
        detectedBy: string;
        resolvedBy: string;
        mitigationPlan: string;
        predictedValue: string;
        actualValue: string;
      };

      if (!result || result.detectedAt === '0') {
        return null;
      }

      return {
        breachId: result.breachId,
        loanId: result.loanId,
        ruleId: result.ruleId,
        severity: parseInt(result.severity) as Severity,
        status: parseInt(result.status),
        detectedAt: parseInt(result.detectedAt),
        resolvedAt: parseInt(result.resolvedAt),
        detectedBy: result.detectedBy,
        resolvedBy: result.resolvedBy,
        mitigationPlan: result.mitigationPlan,
        predictedValue: parseInt(result.predictedValue),
        actualValue: parseInt(result.actualValue),
      };

    } catch (error) {
      Logger.error('Error getting breach:', error);
      throw error;
    }
  }

  /**
   * Get audit entries
   */
  async getAuditEntries(
    limit: number = 10,
    offset: number = 0
  ): Promise<AuditEntry[]> {
    try {
      if (!this.auditLedger) {
        throw new Error('AuditLedger contract not loaded');
      }

      const result = await this.auditLedger.methods
        .getRecentAudits(limit, offset)
        .call();

      return result.map((entry: any) => ({
        entryId: parseInt(entry.entryId),
        action: parseInt(entry.action),
        entityId: entry.entityId,
        actor: entry.actor,
        timestamp: parseInt(entry.timestamp),
        previousStateHash: entry.previousStateHash,
        newStateHash: entry.newStateHash,
        metadata: entry.metadata,
      }));

    } catch (error) {
      Logger.error('Error getting audit entries:', error);
      throw error;
    }
  }

  /**
   * Get blockchain health status
   */
  async getHealthStatus(): Promise<{
    healthy: boolean;
    networkId: number;
    blockNumber: number;
    isSyncing: boolean;
    gasPrice: string;
    walletAddress: string | null;
    timestamp: string;
  }> {
    try {
      const networkId = await this.web3.eth.net.getId();
      const blockNumberBigInt = await this.web3.eth.getBlockNumber();
      const blockNumber = Number(blockNumberBigInt);
      const isSyncing = await this.web3.eth.isSyncing();
      const gasPrice = await this.web3.eth.getGasPrice();

      return {
        healthy: true,
        networkId: Number(networkId),
        blockNumber,
        isSyncing: isSyncing !== false,
        gasPrice: this.web3.utils.fromWei(gasPrice, 'gwei'),
        walletAddress: this.walletAddress,
        timestamp: new Date().toISOString(),
      };

    } catch (error: any) {
      return {
        healthy: false,
        networkId: 0,
        blockNumber: 0,
        isSyncing: false,
        gasPrice: '0',
        walletAddress: null,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(): Promise<string> {
    try {
      if (!this.walletAddress) {
        throw new Error('Wallet not initialized');
      }

      const balance = await this.web3.eth.getBalance(this.walletAddress);
      return this.web3.utils.fromWei(balance, 'ether');

    } catch (error) {
      Logger.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.covenantRegistry || !this.governanceRules) {
      return;
    }

    // Covenant registered events
    this.covenantRegistry.events.CovenantRegistered({
      fromBlock: 'latest'
    })
      .on('data', (event: any) => {
        Logger.info('New covenant registered:', event.returnValues);
        this.emit('covenant-registered', event.returnValues);
      })
      .on('error', (error: any) => {
        Logger.error('CovenantRegistry event error:', error);
      });

    // Breach detected events
    this.governanceRules.events.BreachDetected({
      fromBlock: 'latest'
    })
      .on('data', (event: any) => {
        Logger.info('New breach detected:', event.returnValues);
        this.emit('breach-detected', event.returnValues);
      })
      .on('error', (error: any) => {
        Logger.error('GovernanceRules event error:', error);
      });

    // Audit events
    if (this.auditLedger) {
      this.auditLedger.events.AuditEntryCreated({
        fromBlock: 'latest'
      })
        .on('data', (event: any) => {
          Logger.info('New audit entry:', event.returnValues);
          this.emit('audit-entry-created', event.returnValues);
        })
        .on('error', (error: any) => {
          Logger.error('AuditLedger event error:', error);
        });
    }

    // ESG events
    if (this.esgCompliance) {
      this.esgCompliance.events.ESGScoreRecorded({
        fromBlock: 'latest'
      })
        .on('data', (event: any) => {
          Logger.info('New ESG score recorded:', event.returnValues);
          this.emit('esg-score-recorded', event.returnValues);
        })
        .on('error', (error: any) => {
          Logger.error('ESGCompliance event error:', error);
        });
    }
  }

  /**
   * Event emitter pattern
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    if (this.eventListeners.has(event)) {
      const callbacks = this.eventListeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach(callback => {
        callback(data);
      });
    }
  }

  /**
   * Check if service is connected
   */
  isServiceConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get wallet address
   */
  getWalletAddress(): string | null {
    return this.walletAddress;
  }

  /**
   * Send transaction with retry logic
   */
  async sendTransactionWithRetry(
    txObject: any,
    maxRetries: number = 3
  ): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await txObject.send({ from: this.walletAddress });
      } catch (error: any) {
        if (i === maxRetries - 1) throw error;
        
        if (error.message.includes('nonce')) {
          // Nonce issue - wait and retry
          await this.delay(1000 * (i + 1));
        } else if (error.message.includes('gas')) {
          // Gas issue - adjust and retry
          await this.delay(1000 * (i + 1));
        } else {
          // Other error - wait with exponential backoff
          await this.delay(1000 * Math.pow(2, i));
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance for easy access
export const blockchainService = new BlockchainService();