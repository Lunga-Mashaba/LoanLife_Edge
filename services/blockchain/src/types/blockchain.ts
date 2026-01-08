export interface BlockchainConfig {
  rpcUrl: string;
  chainId: number;
  network: string;
  gasLimit: number;
  gasPrice?: string;
  confirmations: number;
  timeout: number;
  contracts: {
    [key: string]: {
      address: string;
      abi: any[];
      deployedAt?: number;
      verified?: boolean;
    };
  };
}

export interface TransactionOptions {
  from: string;
  gas?: number;
  gasPrice?: string;
  value?: string;
  nonce?: number;
  chainId?: number;
}

export interface EventSubscription {
  contract: string;
  event: string;
  fromBlock: number | string;
  toBlock?: number | string;
  filter?: any;
  callback: (event: any) => void;
}

export interface BlockHeader {
  number: number;
  hash: string;
  parentHash: string;
  nonce: string;
  sha3Uncles: string;
  logsBloom: string;
  transactionsRoot: string;
  stateRoot: string;
  receiptsRoot: string;
  miner: string;
  difficulty: string;
  totalDifficulty: string;
  extraData: string;
  size: number;
  gasLimit: number;
  gasUsed: number;
  timestamp: number;
  transactions: string[];
  uncles: string[];
}

export interface TransactionDetails {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gas: number;
  input: string;
  v: string;
  r: string;
  s: string;
}

export interface LogFilter {
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string | string[];
  topics?: (string | string[] | null)[];
}

export interface FeeData {
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  lastBaseFeePerGas?: string;
}

export interface GasEstimation {
  standard: FeeData;
  fast: FeeData;
  instant: FeeData;
  baseFeePerGas?: string;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
  ensAddress?: string;
  supportsEIP1559: boolean;
}

export interface AccountBalance {
  address: string;
  balance: string;
  nonce: number;
  codeHash: string;
  storageRoot: string;
}

export interface ContractReadResult {
  success: boolean;
  data?: any;
  error?: string;
  gasUsed?: number;
}

export interface ContractWriteResult {
  success: boolean;
  transactionHash?: string;
  receipt?: any;
  error?: string;
  gasUsed?: number;
}

export interface EventLogResult {
  success: boolean;
  events?: any[];
  error?: string;
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  receipt?: any;
  error?: string;
}

export interface VerificationResult {
  success: boolean;
  message?: string;
  verified?: boolean;
}

export interface BlockchainSyncStatus {
  currentBlock: number;
  highestBlock: number;
  startingBlock: number;
  syncing: boolean;
  progress: number;
}

export interface PeerInfo {
  id: string;
  name: string;
  caps: string[];
  network: {
    localAddress: string;
    remoteAddress: string;
  };
  protocols: any;
}

export interface NodeInfo {
  enode: string;
  id: string;
  ip: string;
  listenAddr: string;
  name: string;
  ports: {
    discovery: number;
    listener: number;
  };
  protocols: any;
}

export interface BlockchainMetrics {
  blockTime: number;
  transactionCount: number;
  gasUsed: number;
  gasLimit: number;
  difficulty: string;
  totalTransactions: number;
  pendingTransactions: number;
  activeAccounts: number;
  contractCount: number;
  averageGasPrice: string;
}

export interface TransactionAnalysis {
  hash: string;
  type: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
  totalCost: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: number;
  blockNumber: number;
  contractInteraction?: {
    method: string;
    parameters: any[];
  };
  events: any[];
}

export interface SmartContract {
  address: string;
  name: string;
  abi: any[];
  bytecode: string;
  deployed: boolean;
  sourceCode?: string;
  compilerVersion?: string;
  optimization?: boolean;
  runs?: number;
  verified: boolean;
  creator: string;
  creationTx: string;
  creationTime: number;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  owner: string;
}

export interface NFTInfo {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  owner: string;
  tokenURI: string;
}

export interface BridgeInfo {
  sourceChain: NetworkInfo;
  targetChain: NetworkInfo;
  bridgeAddress: string;
  supportedTokens: TokenInfo[];
  fees: {
    bridgeFee: string;
    gasFee: string;
    totalFee: string;
  };
  minAmount: string;
  maxAmount: string;
  processingTime: number;
}

export interface OracleInfo {
  address: string;
  name: string;
  description: string;
  dataSources: string[];
  updateFrequency: number;
  lastUpdate: number;
  accuracy: number;
  fees: {
    queryFee: string;
    subscriptionFee: string;
  };
}

export interface DeFiPool {
  address: string;
  name: string;
  protocol: string;
  tokens: TokenInfo[];
  reserves: string[];
  totalLiquidity: string;
  apr: number;
  volume24h: string;
  fees24h: string;
}

export interface StakingInfo {
  address: string;
  token: TokenInfo;
  totalStaked: string;
  apr: number;
  lockPeriod: number;
  minStake: string;
  rewards: {
    token: TokenInfo;
    rate: string;
    distribution: string;
  };
}

export interface GovernanceProposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  startBlock: number;
  endBlock: number;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  executed: boolean;
  canceled: boolean;
  state: 'pending' | 'active' | 'canceled' | 'defeated' | 'succeeded' | 'queued' | 'expired' | 'executed';
}