export class Validator {
  /**
   * Validate Ethereum address
   */
  static isValidAddress(address: string): boolean {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  }

  /**
   * Validate loan ID format
   */
  static isValidLoanId(loanId: string): boolean {
    const regex = /^LOAN-\d{4}-\d{3,}$/;
    return regex.test(loanId);
  }

  /**
   * Validate covenant type
   */
  static isValidCovenantType(covenantType: string): boolean {
    const validTypes = [
      'FINANCIAL',
      'ESG',
      'OPERATIONAL',
      'REPORTING',
      'COMPLIANCE',
      'OTHER'
    ];
    return validTypes.includes(covenantType.toUpperCase());
  }

  /**
   * Validate severity level
   */
  static isValidSeverity(severity: number): boolean {
    return severity >= 0 && severity <= 3;
  }

  /**
   * Validate ESG scores (0-100)
   */
  static isValidESGScore(score: number): boolean {
    return score >= 0 && score <= 100;
  }

  /**
   * Validate threshold value
   */
  static isValidThreshold(threshold: number): boolean {
    return threshold >= 0;
  }

  /**
   * Validate grace period (1-365 days)
   */
  static isValidGracePeriod(days: number): boolean {
    return days >= 1 && days <= 365;
  }

  /**
   * Validate predicted value
   */
  static isValidPredictedValue(value: number): boolean {
    return value >= 0;
  }

  /**
   * Validate covenant data structure
   */
  static isValidCovenantData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    // Basic required fields
    const requiredFields = ['loanId', 'covenantType', 'threshold'];
    for (const field of requiredFields) {
      if (!data[field]) return false;
    }
    
    // Validate field types
    if (typeof data.loanId !== 'string') return false;
    if (typeof data.covenantType !== 'string') return false;
    if (typeof data.threshold !== 'number') return false;
    
    return true;
  }

  /**
   * Validate breach data structure
   */
  static isValidBreachData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const requiredFields = ['breachId', 'loanId', 'ruleId', 'severity', 'predictedValue'];
    for (const field of requiredFields) {
      if (!data[field]) return false;
    }
    
    // Validate types
    if (typeof data.breachId !== 'string') return false;
    if (typeof data.loanId !== 'string') return false;
    if (typeof data.ruleId !== 'string') return false;
    if (typeof data.severity !== 'number') return false;
    if (typeof data.predictedValue !== 'number') return false;
    
    // Validate severity range
    if (!this.isValidSeverity(data.severity)) return false;
    
    return true;
  }

  /**
   * Validate rule data structure
   */
  static isValidRuleData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const requiredFields = ['ruleId', 'covenantType', 'threshold', 'approvers', 'gracePeriod'];
    for (const field of requiredFields) {
      if (!data[field]) return false;
    }
    
    // Validate types
    if (typeof data.ruleId !== 'string') return false;
    if (typeof data.covenantType !== 'string') return false;
    if (typeof data.threshold !== 'number') return false;
    if (!Array.isArray(data.approvers)) return false;
    if (typeof data.gracePeriod !== 'number') return false;
    
    // Validate approvers
    if (data.approvers.length === 0) return false;
    for (const approver of data.approvers) {
      if (!this.isValidAddress(approver)) return false;
    }
    
    // Validate threshold and grace period
    if (!this.isValidThreshold(data.threshold)) return false;
    if (!this.isValidGracePeriod(data.gracePeriod)) return false;
    
    return true;
  }

  /**
   * Validate ESG data structure
   */
  static isValidESGData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const requiredFields = ['loanId', 'environmental', 'social', 'governance', 'evidenceHash'];
    for (const field of requiredFields) {
      if (!data[field]) return false;
    }
    
    // Validate types and ranges
    if (typeof data.loanId !== 'string') return false;
    if (!this.isValidESGScore(data.environmental)) return false;
    if (!this.isValidESGScore(data.social)) return false;
    if (!this.isValidESGScore(data.governance)) return false;
    if (typeof data.evidenceHash !== 'string' || data.evidenceHash.length === 0) return false;
    
    return true;
  }

  /**
   * Validate transaction hash
   */
  static isValidTransactionHash(txHash: string): boolean {
    const regex = /^0x[a-fA-F0-9]{64}$/;
    return regex.test(txHash);
  }

  /**
   * Validate block number
   */
  static isValidBlockNumber(blockNumber: number): boolean {
    return Number.isInteger(blockNumber) && blockNumber >= 0;
  }

  /**
   * Validate timestamp (Unix timestamp in seconds)
   */
  static isValidTimestamp(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return Number.isInteger(timestamp) && timestamp > 0 && timestamp <= now + 300; // Allow 5min future drift
  }

  /**
   * Validate JSON string
   */
  static isValidJSON(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate email address
   */
  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string): boolean {
    // At least 8 characters, with uppercase, lowercase, number, and special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  /**
   * Validate URL
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate IPFS hash
   */
  static isValidIPFSHash(hash: string): boolean {
    const regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    return regex.test(hash);
  }

  /**
   * Validate hex string
   */
  static isValidHex(hex: string, length?: number): boolean {
    const regex = length 
      ? new RegExp(`^0x[a-fA-F0-9]{${length}}$`)
      : /^0x[a-fA-F0-9]+$/;
    return regex.test(hex);
  }

  /**
   * Validate percentage (0-100)
   */
  static isValidPercentage(percentage: number): boolean {
    return percentage >= 0 && percentage <= 100;
  }

  /**
   * Validate positive integer
   */
  static isPositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0;
  }

  /**
   * Validate non-negative integer
   */
  static isNonNegativeInteger(value: number): boolean {
    return Number.isInteger(value) && value >= 0;
  }

  /**
   * Validate positive number
   */
  static isPositiveNumber(value: number): boolean {
    return typeof value === 'number' && value > 0 && !isNaN(value);
  }

  /**
   * Validate non-empty string
   */
  static isNonEmptyString(str: string): boolean {
    return typeof str === 'string' && str.trim().length > 0;
  }

  /**
   * Validate array with minimum length
   */
  static isValidArray(arr: any[], minLength: number = 1): boolean {
    return Array.isArray(arr) && arr.length >= minLength;
  }
}