export interface Covenant {
  hash: string;
  timestamp: number;
  registeredBy: string;
  loanId: string;
  covenantType: string;
}

export interface GovernanceRule {
  ruleId: string;
  covenantType: string;
  threshold: number;
  approvers: string[];
  gracePeriod: number;
  isActive: boolean;
  createdAt: number;
  breachCount: number;
}

export enum Severity {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  CRITICAL = 3
}

export enum BreachStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  MITIGATED = 3
}

export interface Breach {
  breachId: string;
  loanId: string;
  ruleId: string;
  severity: Severity;
  status: BreachStatus;
  detectedAt: number;
  resolvedAt: number;
  detectedBy: string;
  resolvedBy: string;
  mitigationPlan: string;
  predictedValue: number;
  actualValue: number;
}

export enum AuditAction {
  COVENANT_REGISTERED = 0,
  COVENANT_UPDATED = 1,
  COVENANT_VERIFIED = 2,
  RULE_CREATED = 3,
  RULE_UPDATED = 4,
  BREACH_DETECTED = 5,
  BREACH_STATUS_CHANGED = 6,
  BREACH_RESOLVED = 7,
  ESG_SCORE_UPDATED = 8,
  GOVERNANCE_ACTION = 9
}

export interface AuditEntry {
  entryId: number;
  action: AuditAction;
  entityId: string;
  actor: string;
  timestamp: number;
  previousStateHash: string;
  newStateHash: string;
  metadata: string;
}

export enum ESGPillar {
  ENVIRONMENTAL = 0,
  SOCIAL = 1,
  GOVERNANCE = 2
}

export interface ESGScore {
  environmental: number;
  social: number;
  governance: number;
  timestamp: number;
  scoredBy: string;
  evidenceHash: string;
}

export interface ESGRequirement {
  requirementId: string;
  pillar: ESGPillar;
  minScore: number;
  weight: number;
  isActive: boolean;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: number;
  gasPrice: string;
  nonce: number;
  blockNumber: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: string[];
  gasUsed: number;
  gasLimit: number;
}

export interface EventLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
  removed: boolean;
}

export interface ContractCall {
  to: string;
  data: string;
  value?: string;
  gas?: number;
  gasPrice?: string;
}

export interface ContractDeployment {
  bytecode: string;
  abi: any[];
  arguments?: any[];
  contractName: string;
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface Wallet {
  address: string;
  privateKey?: string;
  balance: string;
  nonce: number;
}

export interface GasEstimate {
  gasLimit: number;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedCost: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  gasUsed: number;
  cumulativeGasUsed: number;
  contractAddress?: string;
  logs: EventLog[];
  status: boolean;
  from: string;
  to: string;
}

export interface BlockchainHealth {
  healthy: boolean;
  networkId: number;
  blockNumber: number;
  isSyncing: boolean;
  gasPrice: string;
  peerCount?: number;
  latency?: number;
  lastBlockTime?: number;
  timestamp: string;
}

export interface CovenantVerification {
  loanId: string;
  hash: string;
  isValid: boolean;
  verifiedAt: number;
  verifiedBy: string;
}

export interface BreachAnalysis {
  breachId: string;
  loanId: string;
  ruleId: string;
  severity: Severity;
  predictedValue: number;
  actualValue?: number;
  deviation: number;
  confidence: number;
  timestamp: number;
}

export interface ESGTrend {
  loanId: string;
  period: number;
  trend: 'improving' | 'stable' | 'declining';
  environmentalChange: number;
  socialChange: number;
  governanceChange: number;
  totalChange: number;
  startDate: number;
  endDate: number;
}

export interface AuditTrail {
  entries: AuditEntry[];
  total: number;
  startBlock: number;
  endBlock: number;
  merkleRoot: string;
  verified: boolean;
}

export interface ContractState {
  address: string;
  name: string;
  bytecode: string;
  deployedAt: number;
  deployedBy: string;
  verified: boolean;
  functions: string[];
  events: string[];
  totalTransactions: number;
  lastTransaction: number;
}