import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { Logger } from '../utils/Logger';

export class ContractService {
  private web3: Web3;
  private contracts: Map<string, Contract> = new Map();

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  /**
   * Load a contract
   */
  async loadContract(
    contractName: string,
    address: string,
    abi: AbiItem[]
  ): Promise<Contract> {
    try {
      const contract = new this.web3.eth.Contract(abi, address);
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
  getContract(contractName: string): Contract {
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
    params: any[],
    from: string
  ): Promise<number> {
    try {
      const contract = this.getContract(contractName);
      const gasEstimate = await contract.methods[method](...params)
        .estimateGas({ from });
      
      return Math.floor(gasEstimate * 1.2); // Add 20% buffer
    } catch (error) {
      Logger.error(`Gas estimation failed for ${contractName}.${method}:`, error);
      throw error;
    }
  }

  /**
   * Call a view/pure function
   */
  async call(
    contractName: string,
    method: string,
    params: any[] = []
  ): Promise<any> {
    try {
      const contract = this.getContract(contractName);
      return await contract.methods[method](...params).call();
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
    params: any[],
    options: {
      from: string;
      gas?: number;
      gasPrice?: string;
      value?: string;
    }
  ): Promise<any> {
    try {
      const contract = this.getContract(contractName);
      
      // Estimate gas if not provided
      if (!options.gas) {
        options.gas = await this.estimateGas(contractName, method, params, options.from);
      }
      
      // Get gas price if not provided
      if (!options.gasPrice) {
        options.gasPrice = await this.web3.eth.getGasPrice();
      }
      
      return await contract.methods[method](...params).send(options);
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
    options: any = {}
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
    return contract.options.address;
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
      
      // Compare bytecode (strip metadata)
      const cleanActual = actualBytecode.replace(/a165627a7a72305820\w{64}0029$/, '');
      const cleanExpected = expectedBytecode.replace(/a165627a7a72305820\w{64}0029$/, '');
      
      return cleanActual === cleanExpected;
    } catch (error) {
      Logger.error(`Bytecode verification failed for ${contractName}:`, error);
      return false;
    }
  }
}