import { ethers } from "hardhat";
import { BlockchainService } from "../../src/services/BlockchainServices";
import { Logger } from "../../src/utils/Logger";
import { Validator } from "../../src/utils/Validator";
import { Hasher } from "../../src/utils/Hasher";
import fs from "fs";
import path from "path";

// Configuration
const SIMULATION_CONFIG = {
  numberOfLoans: 3,
  numberOfRules: 2,
  numberOfBreaches: 2,
  delayBetweenTransactions: 1000, // ms
  saveResults: true,
  resultsFile: "simulation-results.json"
};

// Mock data
const MOCK_DATA = {
  loans: [
    {
      id: "LOAN-2023-001",
      borrower: "Tech Innovators Inc.",
      amount: "1,500,000",
      currency: "USD",
      interestRate: "5.5%",
      term: "60 months",
      purpose: "Equipment financing",
      riskRating: "A"
    },
    {
      id: "LOAN-2023-002",
      borrower: "Green Energy Solutions",
      amount: "2,750,000",
      currency: "USD",
      interestRate: "4.8%",
      term: "84 months",
      purpose: "Solar farm development",
      riskRating: "B+"
    },
    {
      id: "LOAN-2023-003",
      borrower: "Healthcare Systems Ltd",
      amount: "5,000,000",
      currency: "USD",
      interestRate: "6.2%",
      term: "120 months",
      purpose: "Hospital expansion",
      riskRating: "A-"
    }
  ],
  
  covenants: [
    {
      type: "FINANCIAL",
      metrics: [
        {
          name: "Debt-to-EBITDA",
          threshold: 3.5,
          frequency: "QUARTERLY",
          description: "Total debt divided by earnings before interest, taxes, depreciation, and amortization"
        },
        {
          name: "Interest Coverage Ratio",
          threshold: 2.0,
          frequency: "QUARTERLY",
          description: "EBIT divided by interest expenses"
        },
        {
          name: "Current Ratio",
          threshold: 1.5,
          frequency: "QUARTERLY",
          description: "Current assets divided by current liabilities"
        }
      ]
    },
    {
      type: "ESG",
      metrics: [
        {
          name: "Carbon Emissions",
          threshold: 10000, // tons CO2/year
          frequency: "ANNUAL",
          description: "Total carbon emissions"
        },
        {
          name: "Employee Diversity",
          threshold: 30, // percentage
          frequency: "ANNUAL",
          description: "Percentage of diverse employees"
        },
        {
          name: "Board Independence",
          threshold: 50, // percentage
          frequency: "ANNUAL",
          description: "Percentage of independent board members"
        }
      ]
    }
  ],
  
  rules: [
    {
      ruleId: "DTE-001",
      covenantType: "DEBT_TO_EBITDA",
      threshold: ethers.parseUnits("3.5", 18),
      description: "Debt-to-EBITDA must not exceed 3.5x",
      severityMapping: {
        LOW: 3.6,
        MEDIUM: 4.0,
        HIGH: 4.5,
        CRITICAL: 5.0
      }
    },
    {
      ruleId: "LTV-001",
      covenantType: "LOAN_TO_VALUE",
      threshold: ethers.parseUnits("0.8", 18),
      description: "Loan-to-value ratio must not exceed 80%",
      severityMapping: {
        LOW: 0.82,
        MEDIUM: 0.85,
        HIGH: 0.90,
        CRITICAL: 0.95
      }
    },
    {
      ruleId: "ESG-ENV-001",
      covenantType: "ESG_ENVIRONMENTAL",
      threshold: 70, // Minimum ESG environmental score
      description: "Environmental ESG score must be at least 70",
      severityMapping: {
        LOW: 65,
        MEDIUM: 60,
        HIGH: 50,
        CRITICAL: 40
      }
    }
  ],
  
  esgScores: [
    {
      environmental: 75,
      social: 80,
      governance: 85,
      evidenceHash: "QmX1a2b3c4d5e6f7890abcdef1234567890"
    },
    {
      environmental: 60,
      social: 70,
      governance: 65,
      evidenceHash: "QmY1a2b3c4d5e6f7890abcdef1234567890"
    },
    {
      environmental: 85,
      social: 90,
      governance: 88,
      evidenceHash: "QmZ1a2b3c4d5e6f7890abcdef1234567890"
    }
  ]
};

interface SimulationResult {
  timestamp: string;
  network: string;
  duration: number;
  successful: number;
  failed: number;
  transactions: Array<{
    type: string;
    id: string;
    success: boolean;
    transactionHash?: string;
    blockNumber?: number;
    error?: string;
    timestamp: string;
  }>;
  summary: {
    covenantsRegistered: number;
    rulesCreated: number;
    breachesDetected: number;
    esgScoresRecorded: number;
    walletBalance: string;
    gasUsed: number;
  };
}

class LoanLifeSimulation {
  private blockchainService: BlockchainService;
  private results: SimulationResult;
  private startTime: number;
  private walletAddress: string | null = null;
  private transactionCount = 0;
  private successfulTransactions = 0;
  private failedTransactions = 0;
  private totalGasUsed = 0;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.results = {
      timestamp: new Date().toISOString(),
      network: "local",
      duration: 0,
      successful: 0,
      failed: 0,
      transactions: [],
      summary: {
        covenantsRegistered: 0,
        rulesCreated: 0,
        breachesDetected: 0,
        esgScoresRecorded: 0,
        walletBalance: "0",
        gasUsed: 0
      }
    };
    this.startTime = Date.now();
  }

  /**
   * Run complete simulation
   */
  async run(): Promise<void> {
    Logger.info("🚀 Starting LoanLife Edge Blockchain Simulation");
    Logger.info("=".repeat(70));
    
    try {
      // Step 1: Initialize
      await this.step1_initialize();
      
      // Step 2: Create governance rules
      await this.step2_createRules();
      
      // Step 3: Register covenants
      await this.step3_registerCovenants();
      
      // Step 4: Record ESG scores
      await this.step4_recordESGScores();
      
      // Step 5: Simulate breaches
      await this.step5_simulateBreaches();
      
      // Step 6: Verify and validate
      await this.step6_verification();
      
      // Step 7: Generate report
      await this.step7_generateReport();
      
    } catch (error: any) {
      Logger.error("Simulation failed:", error);
      this.addTransaction("ERROR", "SIMULATION_FAILED", false, undefined, undefined, error.message);
    } finally {
      this.finalizeSimulation();
    }
  }

  /**
   * Step 1: Initialize blockchain service
   */
  private async step1_initialize(): Promise<void> {
    Logger.info("1. INITIALIZING BLOCKCHAIN SERVICE");
    Logger.info("-".repeat(40));
    
    try {
      const initialized = await this.blockchainService.initialize();
      if (initialized) {
        const health = await this.blockchainService.getHealthStatus();
        this.walletAddress = health.walletAddress;
        this.results.network = `Network ${health.networkId}`;
        
        Logger.success(`✅ Connected to network: ${health.networkId}`);
        Logger.info(`📦 Block number: ${health.blockNumber}`);
        Logger.info(`👛 Wallet address: ${this.walletAddress}`);
        Logger.info(`⛽ Gas price: ${health.gasPrice} Gwei`);
        
        this.addTransaction("INITIALIZE", "BLOCKCHAIN_INIT", true);
      }
    } catch (error: any) {
      Logger.error("❌ Failed to initialize blockchain:", error);
      throw error;
    }
    
    await this.delay();
  }

  /**
   * Step 2: Create governance rules
   */
  private async step2_createRules(): Promise<void> {
    Logger.info("\n2. CREATING GOVERNANCE RULES");
    Logger.info("-".repeat(40));
    
    for (let i = 0; i < Math.min(SIMULATION_CONFIG.numberOfRules, MOCK_DATA.rules.length); i++) {
      const rule = MOCK_DATA.rules[i];
      
      try {
        Logger.info(`Creating rule: ${rule.ruleId} - ${rule.description}`);
        
        const result = await this.blockchainService.createRule({
          ruleId: rule.ruleId,
          covenantType: rule.covenantType,
          threshold: typeof rule.threshold === "bigint" ? Number(rule.threshold) : rule.threshold,
          approvers: [this.walletAddress!],
          gracePeriod: 30
        });
        
        if (result.success) {
          Logger.success(`✅ Rule created: ${rule.ruleId}`);
          this.results.summary.rulesCreated++;
          this.addTransaction("CREATE_RULE", rule.ruleId, true, result.transactionHash, result.blockNumber);
        } else {
          Logger.error(`❌ Failed to create rule ${rule.ruleId}: ${result.error}`);
          this.addTransaction("CREATE_RULE", rule.ruleId, false, undefined, undefined, result.error);
        }
        
      } catch (error: any) {
        Logger.error(`❌ Error creating rule ${rule.ruleId}:`, error.message);
        this.addTransaction("CREATE_RULE", rule.ruleId, false, undefined, undefined, error.message);
      }
      
      await this.delay();
    }
    
    Logger.info(`Created ${this.results.summary.rulesCreated} governance rules`);
  }

  /**
   * Step 3: Register covenants
   */
  private async step3_registerCovenants(): Promise<void> {
    Logger.info("\n3. REGISTERING COVENANTS");
    Logger.info("-".repeat(40));
    
    for (let i = 0; i < Math.min(SIMULATION_CONFIG.numberOfLoans, MOCK_DATA.loans.length); i++) {
      const loan = MOCK_DATA.loans[i];
      const covenantData = this.generateCovenantData(loan);
      
      try {
        Logger.info(`Registering covenant for: ${loan.id} - ${loan.borrower}`);
        
        const result = await this.blockchainService.registerCovenant(
          loan.id,
          covenantData,
          "FINANCIAL"
        );
        
        if (result.success) {
          Logger.success(`✅ Covenant registered: ${loan.id}`);
          this.results.summary.covenantsRegistered++;
          this.addTransaction("REGISTER_COVENANT", loan.id, true, result.transactionHash, result.blockNumber);
          
          // Verify the covenant was stored
          await this.verifyCovenant(loan.id, covenantData, result.data?.covenantHash);
        } else {
          Logger.error(`❌ Failed to register covenant for ${loan.id}: ${result.error}`);
          this.addTransaction("REGISTER_COVENANT", loan.id, false, undefined, undefined, result.error);
        }
        
      } catch (error: any) {
        Logger.error(`❌ Error registering covenant for ${loan.id}:`, error.message);
        this.addTransaction("REGISTER_COVENANT", loan.id, false, undefined, undefined, error.message);
      }
      
      await this.delay();
    }
    
    Logger.info(`Registered ${this.results.summary.covenantsRegistered} covenants`);
  }

  /**
   * Step 4: Record ESG scores
   */
  private async step4_recordESGScores(): Promise<void> {
    Logger.info("\n4. RECORDING ESG SCORES");
    Logger.info("-".repeat(40));
    
    for (let i = 0; i < Math.min(SIMULATION_CONFIG.numberOfLoans, MOCK_DATA.loans.length); i++) {
      const loan = MOCK_DATA.loans[i];
      const esgData = MOCK_DATA.esgScores[i % MOCK_DATA.esgScores.length];
      
      try {
        Logger.info(`Recording ESG score for: ${loan.id}`);
        Logger.info(`  Environmental: ${esgData.environmental}/100`);
        Logger.info(`  Social: ${esgData.social}/100`);
        Logger.info(`  Governance: ${esgData.governance}/100`);
        
        const result = await this.blockchainService.recordESGScore(
          loan.id,
          esgData.environmental,
          esgData.social,
          esgData.governance,
          esgData.evidenceHash
        );
        
        if (result.success) {
          Logger.success(`✅ ESG score recorded: ${loan.id}`);
          this.results.summary.esgScoresRecorded++;
          this.addTransaction("RECORD_ESG", loan.id, true, result.transactionHash, result.blockNumber);
          
          // Get and display ESG score
          await this.displayESGScore(loan.id);
        } else {
          Logger.error(`❌ Failed to record ESG score for ${loan.id}: ${result.error}`);
          this.addTransaction("RECORD_ESG", loan.id, false, undefined, undefined, result.error);
        }
        
      } catch (error: any) {
        Logger.error(`❌ Error recording ESG score for ${loan.id}:`, error.message);
        this.addTransaction("RECORD_ESG", loan.id, false, undefined, undefined, error.message);
      }
      
      await this.delay();
    }
    
    Logger.info(`Recorded ${this.results.summary.esgScoresRecorded} ESG scores`);
  }

  /**
   * Step 5: Simulate breaches
   */
  private async step5_simulateBreaches(): Promise<void> {
    Logger.info("\n5. SIMULATING BREACH DETECTION");
    Logger.info("-".repeat(40));
    
    const breachScenarios = this.generateBreachScenarios();
    
    for (let i = 0; i < Math.min(SIMULATION_CONFIG.numberOfBreaches, breachScenarios.length); i++) {
      const scenario = breachScenarios[i];
      
      try {
        Logger.info(`Detecting breach: ${scenario.breachId}`);
        Logger.info(`  Loan: ${scenario.loanId}`);
        Logger.info(`  Rule: ${scenario.ruleId}`);
        Logger.info(`  Severity: ${this.getSeverityName(scenario.severity)}`);
        Logger.info(`  Predicted value: ${scenario.predictedValue}`);
        
        const result = await this.blockchainService.detectBreach(scenario);
        
        if (result.success) {
          Logger.success(`✅ Breach detected: ${scenario.breachId}`);
          this.results.summary.breachesDetected++;
          this.addTransaction("DETECT_BREACH", scenario.breachId, true, result.transactionHash, result.blockNumber);
          
          // Get breach details
          await this.displayBreachDetails(scenario.breachId);
        } else {
          Logger.error(`❌ Failed to detect breach ${scenario.breachId}: ${result.error}`);
          this.addTransaction("DETECT_BREACH", scenario.breachId, false, undefined, undefined, result.error);
        }
        
      } catch (error: any) {
        Logger.error(`❌ Error detecting breach ${scenario.breachId}:`, error.message);
        this.addTransaction("DETECT_BREACH", scenario.breachId, false, undefined, undefined, error.message);
      }
      
      await this.delay();
    }
    
    Logger.info(`Detected ${this.results.summary.breachesDetected} breaches`);
  }

  /**
   * Step 6: Verification and validation
   */
  private async step6_verification(): Promise<void> {
    Logger.info("\n6. VERIFICATION AND VALIDATION");
    Logger.info("-".repeat(40));
    
    try {
      // Get wallet balance
      const balance = await this.blockchainService.getWalletBalance();
      this.results.summary.walletBalance = balance;
      Logger.info(`💰 Wallet balance: ${balance} ETH`);
      
      // Get blockchain health
      const health = await this.blockchainService.getHealthStatus();
      Logger.info(`📊 Blockchain health: ${health.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
      Logger.info(`🔗 Current block: ${health.blockNumber}`);
      Logger.info(`⛽ Current gas price: ${health.gasPrice} Gwei`);
      
      // Get transaction count
      Logger.info(`📈 Total transactions in simulation: ${this.transactionCount}`);
      Logger.info(`✅ Successful: ${this.successfulTransactions}`);
      Logger.info(`❌ Failed: ${this.failedTransactions}`);
      
      this.addTransaction("VERIFICATION", "SYSTEM_CHECK", true);
      
    } catch (error: any) {
      Logger.error("❌ Verification failed:", error.message);
      this.addTransaction("VERIFICATION", "SYSTEM_CHECK", false, undefined, undefined, error.message);
    }
    
    await this.delay();
  }

  /**
   * Step 7: Generate final report
   */
  private async step7_generateReport(): Promise<void> {
    Logger.info("\n7. GENERATING SIMULATION REPORT");
    Logger.info("-".repeat(40));
    
    this.results.duration = Date.now() - this.startTime;
    this.results.successful = this.successfulTransactions;
    this.results.failed = this.failedTransactions;
    this.results.summary.gasUsed = this.totalGasUsed;
    
    // Display summary
    Logger.info("\n" + "=".repeat(70));
    Logger.info("🎉 SIMULATION COMPLETE");
    Logger.info("=".repeat(70));
    
    Logger.info("\n📊 EXECUTION SUMMARY");
    Logger.info("-".repeat(30));
    Logger.info(`⏱️  Duration: ${(this.results.duration / 1000).toFixed(2)} seconds`);
    Logger.info(`📦 Network: ${this.results.network}`);
    Logger.info(`👛 Wallet: ${this.walletAddress?.substring(0, 10)}...`);
    Logger.info(`💰 Balance: ${this.results.summary.walletBalance} ETH`);
    Logger.info(`⛽ Gas used: ${this.results.summary.gasUsed} units`);
    
    Logger.info("\n📈 TRANSACTION RESULTS");
    Logger.info("-".repeat(30));
    Logger.info(`✅ Successful: ${this.results.successful}`);
    Logger.info(`❌ Failed: ${this.results.failed}`);
    Logger.info(`📊 Success rate: ${((this.results.successful / this.transactionCount) * 100).toFixed(1)}%`);
    
    Logger.info("\n🏗️  SYSTEM STATE");
    Logger.info("-".repeat(30));
    Logger.info(`📜 Covenants registered: ${this.results.summary.covenantsRegistered}`);
    Logger.info(`⚖️  Governance rules created: ${this.results.summary.rulesCreated}`);
    Logger.info(`🚨 Breaches detected: ${this.results.summary.breachesDetected}`);
    Logger.info(`🌱 ESG scores recorded: ${this.results.summary.esgScoresRecorded}`);
    
    Logger.info("\n🚀 NEXT STEPS");
    Logger.info("-".repeat(30));
    Logger.info("1. Integrate with LoanLife Edge desktop application");
    Logger.info("2. Connect AI prediction engine to blockchain");
    Logger.info("3. Implement user interface for governance workflows");
    Logger.info("4. Add real-time event listeners");
    Logger.info("5. Deploy to testnet for external validation");
    
    Logger.info("\n" + "=".repeat(70));
    Logger.info("💡 The blockchain system is ready for integration!");
    Logger.info("=".repeat(70));
    
    // Save results if enabled
    if (SIMULATION_CONFIG.saveResults) {
      await this.saveResults();
    }
  }

  /**
   * Helper: Generate covenant data
   */
  private generateCovenantData(loan: any): any {
    return {
      loanId: loan.id,
      borrower: loan.borrower,
      amount: loan.amount,
      currency: loan.currency,
      interestRate: loan.interestRate,
      term: loan.term,
      purpose: loan.purpose,
      riskRating: loan.riskRating,
      covenants: MOCK_DATA.covenants,
      effectiveDate: new Date().toISOString(),
      reviewFrequency: "QUARTERLY",
      reportingRequirements: [
        "Financial statements within 45 days of quarter end",
        "Compliance certificates quarterly",
        "Annual ESG report"
      ]
    };
  }

  /**
   * Helper: Generate breach scenarios
   */
  private generateBreachScenarios(): Array<{
    breachId: string;
    loanId: string;
    ruleId: string;
    severity: number;
    predictedValue: number;
  }> {
    const scenarios = [];
    const timestamp = Date.now();
    
    // Scenario 1: Debt-to-EBITDA breach
    scenarios.push({
      breachId: `BREACH-${timestamp}-001`,
      loanId: "LOAN-2023-001",
      ruleId: "DTE-001",
      severity: 2, // HIGH
      predictedValue: 4.2 // Above 3.5 threshold
    });
    
    // Scenario 2: Loan-to-value breach
    scenarios.push({
      breachId: `BREACH-${timestamp}-002`,
      loanId: "LOAN-2023-002",
      ruleId: "LTV-001",
      severity: 1, // MEDIUM
      predictedValue: 0.85 // Above 0.8 threshold
    });
    
    // Scenario 3: ESG environmental breach
    scenarios.push({
      breachId: `BREACH-${timestamp}-003`,
      loanId: "LOAN-2023-003",
      ruleId: "ESG-ENV-001",
      severity: 0, // LOW
      predictedValue: 65 // Below 70 threshold
    });
    
    return scenarios;
  }

  /**
   * Helper: Verify covenant
   */
  private async verifyCovenant(loanId: string, covenantData: any, expectedHash?: string): Promise<void> {
    try {
      // Verify using blockchain
      const isValid = await this.blockchainService.verifyCovenant(loanId, covenantData);
      
      // Verify hash matches
      const computedHash = Hasher.generateCovenantHash(covenantData);
      const hashMatches = !expectedHash || computedHash === expectedHash;
      
      if (isValid && hashMatches) {
        Logger.success(`  ✅ Covenant verified and hash matches`);
      } else {
        Logger.warn(`  ⚠️  Covenant verification issue: isValid=${isValid}, hashMatches=${hashMatches}`);
      }
    } catch (error) {
      Logger.error(`  ❌ Covenant verification failed:`, error);
    }
  }

  /**
   * Helper: Display ESG score
   */
  private async displayESGScore(loanId: string): Promise<void> {
    try {
      const score = await this.blockchainService.getCurrentESGScore(loanId);
      if (score) {
        const total = (score.environmental + score.social + score.governance) / 3;
        Logger.info(`  📊 Current ESG score: ${total.toFixed(1)}/100`);
      }
    } catch (error) {
      // Silently fail - just for display purposes
    }
  }

  /**
   * Helper: Display breach details
   */
  private async displayBreachDetails(breachId: string): Promise<void> {
    try {
      const breach = await this.blockchainService.getBreach(breachId);
      if (breach) {
        Logger.info(`  📋 Breach status: ${this.getBreachStatusName(breach.status)}`);
        if (breach.mitigationPlan) {
          Logger.info(`  🔧 Mitigation: ${breach.mitigationPlan.substring(0, 50)}...`);
        }
      }
    } catch (error) {
      // Silently fail - just for display purposes
    }
  }

  /**
   * Helper: Get severity name
   */
  private getSeverityName(severity: number): string {
    const names = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    return names[severity] || "UNKNOWN";
  }

  /**
   * Helper: Get breach status name
   */
  private getBreachStatusName(status: number): string {
    const names = ["PENDING", "APPROVED", "REJECTED", "MITIGATED"];
    return names[status] || "UNKNOWN";
  }

  /**
   * Helper: Add transaction to results
   */
  private addTransaction(
    type: string,
    id: string,
    success: boolean,
    transactionHash?: string,
    blockNumber?: number,
    error?: string
  ): void {
    const tx = {
      type,
      id,
      success,
      transactionHash,
      blockNumber,
      error,
      timestamp: new Date().toISOString()
    };
    
    this.results.transactions.push(tx);
    this.transactionCount++;
    
    if (success) {
      this.successfulTransactions++;
      if (transactionHash) {
        this.totalGasUsed += 21000; // Approximate gas per transaction
      }
    } else {
      this.failedTransactions++;
    }
  }

  /**
   * Helper: Delay between transactions
   */
  private async delay(ms?: number): Promise<void> {
    const delayMs = ms || SIMULATION_CONFIG.delayBetweenTransactions;
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  /**
   * Helper: Save results to file
   */
  private async saveResults(): Promise<void> {
    try {
      const resultsDir = path.join(__dirname, "..", "..", "simulation-results");
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }
      
      const filePath = path.join(resultsDir, SIMULATION_CONFIG.resultsFile);
      fs.writeFileSync(
        filePath,
        JSON.stringify(this.results, null, 2),
        "utf8"
      );
      
      Logger.info(`\n💾 Results saved to: ${filePath}`);
    } catch (error) {
      Logger.error("Failed to save results:", error);
    }
  }

  /**
   * Finalize simulation
   */
  private finalizeSimulation(): void {
    const duration = Date.now() - this.startTime;
    Logger.info(`\n⏱️  Total simulation time: ${(duration / 1000).toFixed(2)} seconds`);
    
    // Display final statistics
    if (this.transactionCount > 0) {
      const successRate = (this.successfulTransactions / this.transactionCount) * 100;
      Logger.info(`📊 Success rate: ${successRate.toFixed(1)}%`);
    }
    
    Logger.info("\n" + "=".repeat(70));
    Logger.info("🏁 SIMULATION FINISHED");
    Logger.info("=".repeat(70));
  }
}

/**
 * Main simulation runner
 */
async function runSimulation(): Promise<void> {
  Logger.initialize({
    logLevel: "INFO",
    consoleOutput: true,
    fileOutput: false
  });
  
  const simulation = new LoanLifeSimulation();
  
  try {
    await simulation.run();
    
    // Exit with success code
    process.exit(0);
  } catch (error: any) {
    Logger.error("Simulation failed with error:", error);
    
    // Exit with error code
    process.exit(1);
  }
}

// Run the simulation if this file is executed directly
if (require.main === module) {
  runSimulation().catch(error => {
    console.error("Fatal simulation error:", error);
    process.exit(1);
  });
}

export { LoanLifeSimulation, runSimulation };