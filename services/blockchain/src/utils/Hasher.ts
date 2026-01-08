import { createHash } from 'crypto';

export class Hasher {
  /**
   * Generate SHA-256 hash for covenant data
   */
  static generateCovenantHash(data: any): string {
    // Sort keys to ensure consistent hashing
    const sortedData = JSON.stringify(data, Object.keys(data).sort());
    return createHash('sha256').update(sortedData).digest('hex');
  }

  /**
   * Generate unique breach ID
   */
  static generateBreachId(loanId: string, ruleId: string, timestamp: number): string {
    const input = `${loanId}-${ruleId}-${timestamp}`;
    return createHash('sha256').update(input).digest('hex').substring(0, 32);
  }

  /**
   * Verify covenant hash
   */
  static verifyCovenant(data: any, expectedHash: string): boolean {
    const computedHash = this.generateCovenantHash(data);
    return computedHash === expectedHash;
  }

  /**
   * Generate Merkle proof for multiple covenants
   */
  static generateMerkleProof(hashes: string[], targetHash: string): string[] {
    if (hashes.length === 0) return [];
    
    const proof: string[] = [];
    let currentLevel = [...hashes];
    let targetIndex = hashes.indexOf(targetHash);
    
    if (targetIndex === -1) {
      throw new Error('Target hash not found in list');
    }
    
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const parent = createHash('sha256')
          .update(left + right)
          .digest('hex');
        
        nextLevel.push(parent);
        
        // If we're at the target index, add sibling to proof
        if (i === targetIndex || i + 1 === targetIndex) {
          proof.push(i === targetIndex ? right : left);
        }
      }
      
      currentLevel = nextLevel;
      targetIndex = Math.floor(targetIndex / 2);
    }
    
    return proof;
  }
}