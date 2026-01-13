import Web3 from 'web3';
// import { Account } from 'web3-eth-accounts';
import type { create } from 'web3-eth-accounts';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { Logger } from '../utils/Logger';

interface EncryptedWallet {
  address: string;
  encryptedPrivateKey: {
    encrypted: string;
    iv: string;
    authTag: string;
  };
  createdAt: string;
  version: string;
}

type Web3Account = ReturnType<typeof create>;

export class WalletService {
  private web3: Web3;
  private wallet: Web3Account | null = null;
  private walletPath: string;
  private isInitialized: boolean = false;

  constructor(web3: Web3, dataDir: string = '.loanlife-edge') {
    this.web3 = web3;
    
    // Determine appropriate data directory
    const homeDir = process.env.HOME || process.env.USERPROFILE || '.';
    this.walletPath = path.join(homeDir, dataDir, 'wallet.json');
  }

  /**
   * Initialize wallet service
   */
  async initialize(password?: string): Promise<void> {
    try {
      Logger.info('Initializing wallet service...');

      // Check if wallet exists
      const walletExists = await this.walletExists();
      
      if (walletExists) {
        await this.loadWallet(password);
      } else {
        await this.createWallet(password);
      }

      this.isInitialized = true;
      Logger.success(`Wallet service initialized: ${this.getAddress()}`);

    } catch (error) {
      Logger.error('Failed to initialize wallet:', error);
      throw error;
    }
  }

  /**
   * Create new wallet
   */
  private async createWallet(password?: string): Promise<void> {
    try {
      // Generate new account
      const account = this.web3.eth.accounts.create();
      this.wallet = account;

      // Encrypt and save wallet
      await this.saveWallet(password);

      Logger.info(`New wallet created: ${account.address}`);

    } catch (error) {
      Logger.error('Error creating wallet:', error);
      throw error;
    }
  }

  /**
   * Load existing wallet
   */
  private async loadWallet(password?: string): Promise<void> {
    try {
      // Read encrypted wallet file
      const encryptedData = await fs.readFile(this.walletPath, 'utf8');
      const walletData: EncryptedWallet = JSON.parse(encryptedData);

      // Decrypt private key
      let privateKey: string;
      if (password) {
        privateKey = this.decryptPrivateKey(
          walletData.encryptedPrivateKey,
          password
        );
      } else {
        throw new Error('Password required to load wallet');
      }

      // Create account from private key
      this.wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);

      // Verify address matches
      if (this.wallet.address.toLowerCase() !== walletData.address.toLowerCase()) {
        throw new Error('Wallet address mismatch');
      }

      Logger.info(`Wallet loaded: ${this.wallet.address}`);

    } catch (error) {
      Logger.error('Error loading wallet:', error);
      throw error;
    }
  }

  /**
   * Save wallet to encrypted file
   */
  private async saveWallet(password?: string): Promise<void> {
    if (!this.wallet) {
      throw new Error('No wallet to save');
    }

    try {
      // Prepare wallet data
      const walletData: EncryptedWallet = {
        address: this.wallet.address,
        createdAt: new Date().toISOString(),
        version: '1.0',
        encryptedPrivateKey: password 
          ? this.encryptPrivateKey(this.wallet.privateKey, password)
          : { encrypted: '', iv: '', authTag: '' }
      };

      // Ensure directory exists
      const dir = path.dirname(this.walletPath);
      await fs.mkdir(dir, { recursive: true });

      // Save to file
      await fs.writeFile(
        this.walletPath,
        JSON.stringify(walletData, null, 2),
        'utf8'
      );

      Logger.info(`Wallet saved to: ${this.walletPath}`);

    } catch (error) {
      Logger.error('Error saving wallet:', error);
      throw error;
    }
  }

  /**
   * Encrypt private key
   */
  private encryptPrivateKey(privateKey: string, password: string): {
    encrypted: string;
    iv: string;
    authTag: string;
  } {
    // Generate salt and key
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(password, salt, 32);
    
    // Generate IV
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    // Encrypt private key
    const encrypted = Buffer.concat([
      cipher.update(privateKey, 'utf8'),
      cipher.final()
    ]);
    
    // Get auth tag
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted.toString('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Decrypt private key
   */
  private decryptPrivateKey(encryptedData: {
    encrypted: string;
    iv: string;
    authTag: string;
  }, password: string): string {
    try {
      // Generate key from password and salt (using constant salt for demo)
      const salt = Buffer.from('loanlife-edge-salt', 'utf8');
      const key = crypto.scryptSync(password, salt, 32);
      
      // Create decipher
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      // Set auth tag
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      // Decrypt private key
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData.encrypted, 'hex')),
        decipher.final()
      ]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error('Failed to decrypt private key. Invalid password?');
    }
  }

  /**
   * Check if wallet file exists
   */
  private async walletExists(): Promise<boolean> {
    try {
      await fs.access(this.walletPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current wallet address
   */
  getAddress(): string {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    return this.wallet.address;
  }

  /**
   * Get wallet balance
   */
  async getBalance(): Promise<string> {
    try {
      const address = this.getAddress();
      const balance = await this.web3.eth.getBalance(address);
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      Logger.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Sign a message
   */
  signMessage(message: string): {
    message: string;
    messageHash: string;
    signature: string;
  } {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    
    const result = this.web3.eth.accounts.sign(message, this.wallet.privateKey);
    return {
      message: result.message ?? message,
      messageHash: result.messageHash,
      signature: result.signature
    };
  }

  /**
   * Verify signature
   */
  verifySignature(
    message: string,
    signature: string,
    expectedAddress: string
  ): boolean {
    try {
      const recoveredAddress = this.web3.eth.accounts.recover(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      Logger.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Sign a transaction
   */
  async signTransaction(transaction: any): Promise<any> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    
    return this.web3.eth.accounts.signTransaction(transaction, this.wallet.privateKey);
  }

  /**
   * Check if wallet is initialized
   */
  isWalletInitialized(): boolean {
    return this.isInitialized && this.wallet !== null;
  }

  /**
   * Export wallet (for backup)
   */
  async exportWallet(password?: string): Promise<EncryptedWallet> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    
    const walletData: EncryptedWallet = {
      address: this.wallet.address,
      createdAt: new Date().toISOString(),
      version: '1.0',
      encryptedPrivateKey: password
        ? this.encryptPrivateKey(this.wallet.privateKey, password)
        : { encrypted: '', iv: '', authTag: '' }
    };
    
    return walletData;
  }

  /**
   * Import wallet
   */
  async importWallet(
    walletData: EncryptedWallet,
    password: string
  ): Promise<void> {
    try {
      // Decrypt private key
      const privateKey = this.decryptPrivateKey(walletData.encryptedPrivateKey, password);
      
      // Create account from private key
      this.wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      
      // Verify address matches
      if (this.wallet.address.toLowerCase() !== walletData.address.toLowerCase()) {
        throw new Error('Wallet address mismatch');
      }
      
      // Save imported wallet
      await this.saveWallet(password);
      
      this.isInitialized = true;
      Logger.info(`Wallet imported: ${this.wallet.address}`);
      
    } catch (error) {
      Logger.error('Error importing wallet:', error);
      throw error;
    }
  }

  /**
   * Generate recovery phrase (mnemonic)
   * Note: In production, use a proper BIP39 implementation
   */
  generateRecoveryPhrase(): string[] {
    // This is a simplified version for demo purposes
    // In production, use: import { generateMnemonic } from 'bip39';
    const words = [
      'loan', 'life', 'edge', 'blockchain', 'finance', 'secure',
      'digital', 'twin', 'covenant', 'governance', 'audit', 'esg',
      'risk', 'prediction', 'ai', 'integration', 'hackathon', 'win',
      'innovation', 'future', 'banking', 'transparency', 'trust', 'verify'
    ];
    
    // Generate random words
    const recoveryPhrase: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      recoveryPhrase.push(words[randomIndex]);
    }
    
    return recoveryPhrase;
  }
}