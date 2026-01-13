import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { Logger } from '../utils/Logger';

export class ContractService {
  private web3: Web3;
  private contracts: Map<string, any> = new Map();

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  /**
   * Load a contract
   */
  async loadContract(
    contractName: string,
    address: string,
    abi: AbiItem[] | any // Use `any` for broader compatibility
  ): Promise<any> {
    try {
      // Cast abi to appropriate type for web3 v4
      const contract = new this.web3.eth.Contract(abi as any, address);
      this.contracts.set(contractName, contract);
      
      Logger.info(`Contract ${contractName} loaded at ${address}`);
      return contract;
    } catch (error) {
      Logger.error(`Failed to load contract ${contractName}:`, error);
      throw error;
    }
  }

  /**
   * Get a loaded contract
   */
  getContract(contractName: string): any {
    const contract = this.contracts.get(contractName);
    if (!contract) {
      throw new Error(`Contract ${contractName} not loaded`);
    }
    return contract;
  }

  /**
   * Check if contract is loaded
   */
  hasContract(contractName: string): boolean {
    return this.contracts.has(contractName);
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(
    contractName: string,
    method: string,
    params: any[] = [],
    from: string
  ): Promise<bigint> { // Return bigint instead of number for web3 v4
    try {
      const contract = this.getContract(contractName);
      const gasEstimate = await contract.methods[method](...params)
        .estimateGas({ from });
      
      // Add 20% buffer and convert to BigInt
      const gasWithBuffer = (gasEstimate * BigInt(120)) / BigInt(100);
      return gasWithBuffer;
    } catch (error) {
      Logger.error(`Gas estimation failed for ${contractName}.${method}:`, error);
      throw error;
    }
  }

  /**
   * Call a view/pure function
   */
  async call<T = any>(
    contractName: string,
    method: string,
    params: any[] = [],
    options: {
      from?: string;
      gas?: bigint | number;
      gasPrice?: bigint | string;
      value?: bigint | string;
    } = {}
  ): Promise<T> {
    try {
      const contract = this.getContract(contractName);
      return await contract.methods[method](...params).call(options);
    } catch (error) {
      Logger.error(`Call failed for ${contractName}.${method}:`, error);
      throw error;
    }
  }

  /**
   * Send a transaction
   */
  async sendTransaction(
    contractName: string,
    method: string,
    params: any[] = [],
    options: {
      from: string;
      gas?: bigint | number;
      gasPrice?: bigint | string;
      value?: bigint | string;
      maxPriorityFeePerGas?: bigint | string;
      maxFeePerGas?: bigint | string;
      nonce?: number;
    }
  ): Promise<any> {
    try {
      const contract = this.getContract(contractName);
      
      // Prepare transaction data
      const tx = contract.methods[method](...params);
      
      // Estimate gas if not provided
      if (!options.gas) {
        const estimatedGas = await this.estimateGas(
          contractName,
          method,
          params,
          options.from
        );
        options.gas = estimatedGas;
      }
      
      // Convert gasPrice to string if it's bigint
      const txOptions: Record<string, any> = { ...options };
      if (txOptions.gasPrice && typeof txOptions.gasPrice === 'bigint') {
        txOptions.gasPrice = txOptions.gasPrice.toString();
      }
      if (txOptions.value && typeof txOptions.value === 'bigint') {
        txOptions.value = txOptions.value.toString();
      }
      
      return await tx.send(txOptions);
    } catch (error) {
      Logger.error(`Transaction failed for ${contractName}.${method}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe to contract events
   */
  subscribeToEvent(
    contractName: string,
    eventName: string,
    callback: (event: any) => void,
    options: any = {}
  ): void {
    try {
      const contract = this.getContract(contractName);
      contract.events[eventName](options)
        .on('data', callback)
        .on('error', (error: any) => {
          Logger.error(`Event subscription error for ${contractName}.${eventName}:`, error);
        });
    } catch (error) {
      Logger.error(`Failed to subscribe to ${contractName}.${eventName}:`, error);
      throw error;
    }
  }

  /**
   * Get past events
   */
  async getPastEvents(
    contractName: string,
    eventName: string,
    options: {
      filter?: any;
      fromBlock?: number | string;
      toBlock?: number | string;
    } = {}
  ): Promise<any[]> {
    try {
      const contract = this.getContract(contractName);
      return await contract.getPastEvents(eventName, options);
    } catch (error) {
      Logger.error(`Failed to get past events for ${contractName}.${eventName}:`, error);
      throw error;
    }
  }

  /**
   * Get contract address
   */
  getContractAddress(contractName: string): string {
    const contract = this.getContract(contractName);
    return contract.options.address as string;
  }

  /**
   * Verify contract bytecode
   */
  async verifyBytecode(
    contractName: string,
    expectedBytecode: string
  ): Promise<boolean> {
    try {
      const address = this.getContractAddress(contractName);
      const actualBytecode = await this.web3.eth.getCode(address);
      
      // Compare bytecode (strip metadata which varies between compilers)
      // Modern Solidity metadata format
      const metadataRegex = /a264697066735822[0-9a-f]{68}64736f6c6343[0-9a-f]{6}0033$/;
      
      const cleanActual = actualBytecode.replace(metadataRegex, '');
      const cleanExpected = expectedBytecode.replace(metadataRegex, '');
      
      return cleanActual === cleanExpected;
    } catch (error) {
      Logger.error(`Bytecode verification failed for ${contractName}:`, error);
      return false;
    }
  }
}