import fs from 'fs';
import path from 'path';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

export class Logger {
  private static logFile: string;
  private static logLevel: LogLevel = LogLevel.INFO;
  private static consoleOutput: boolean = true;
  private static fileOutput: boolean = false;
  private static maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private static colors = {
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[34m',  // Blue
    [LogLevel.WARN]: '\x1b[33m',  // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
    [LogLevel.SUCCESS]: '\x1b[32m', // Green
    reset: '\x1b[0m'
  };

  /**
   * Initialize logger
   */
  static initialize(options: {
    logFile?: string;
    logLevel?: LogLevel;
    consoleOutput?: boolean;
    fileOutput?: boolean;
    maxFileSize?: number;
  } = {}): void {
    this.logLevel = options.logLevel || LogLevel.INFO;
    this.consoleOutput = options.consoleOutput !== false;
    this.fileOutput = options.fileOutput || false;
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024;

    if (options.logFile) {
      this.logFile = options.logFile;
      this.ensureLogDirectory();
    }
  }

  /**
   * Ensure log directory exists
   */
  private static ensureLogDirectory(): void {
    if (this.logFile) {
      const dir = path.dirname(this.logFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Check if should log based on level
   */
  private static shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.SUCCESS];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Format log message
   */
  private static formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    let formatted = `${prefix} ${message}`;
    
    if (data !== undefined) {
      const dataStr = typeof data === 'object' 
        ? JSON.stringify(data, this.getCircularReplacer(), 2)
        : String(data);
      
      if (dataStr.length > 1000) {
        formatted += `\n${dataStr.substring(0, 1000)}... [truncated]`;
      } else {
        formatted += `\n${dataStr}`;
      }
    }
    
    return formatted;
  }

  /**
   * Handle circular references in JSON
   */
  private static getCircularReplacer(): (key: string, value: any) => any {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      return value;
    };
  }

  /**
   * Write log to file
   */
  private static writeToFile(message: string): void {
    if (!this.logFile || !this.fileOutput) return;

    try {
      // Check file size and rotate if needed
      if (fs.existsSync(this.logFile)) {
        const stats = fs.statSync(this.logFile);
        if (stats.size > this.maxFileSize) {
          this.rotateLogFile();
        }
      }

      // Append to log file
      fs.appendFileSync(this.logFile, message + '\n', 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Rotate log file
   */
  private static rotateLogFile(): void {
    if (!this.logFile || !fs.existsSync(this.logFile)) return;

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFile = `${this.logFile}.${timestamp}`;
      
      fs.renameSync(this.logFile, rotatedFile);
      
      // Keep only last 5 rotated files
      const logDir = path.dirname(this.logFile);
      const logBase = path.basename(this.logFile);
      const files = fs.readdirSync(logDir)
        .filter(file => file.startsWith(logBase) && file !== logBase)
        .sort()
        .reverse();
      
      for (let i = 5; i < files.length; i++) {
        fs.unlinkSync(path.join(logDir, files[i]));
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  /**
   * Log debug message
   */
  static debug(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const formatted = this.formatMessage(LogLevel.DEBUG, message, data);
    
    if (this.consoleOutput) {
      console.debug(`${this.colors[LogLevel.DEBUG]}${formatted}${this.colors.reset}`);
    }
    
    this.writeToFile(formatted);
  }

  /**
   * Log info message
   */
  static info(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const formatted = this.formatMessage(LogLevel.INFO, message, data);
    
    if (this.consoleOutput) {
      console.info(`${this.colors[LogLevel.INFO]}${formatted}${this.colors.reset}`);
    }
    
    this.writeToFile(formatted);
  }

  /**
   * Log warning message
   */
  static warn(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const formatted = this.formatMessage(LogLevel.WARN, message, data);
    
    if (this.consoleOutput) {
      console.warn(`${this.colors[LogLevel.WARN]}${formatted}${this.colors.reset}`);
    }
    
    this.writeToFile(formatted);
  }

  /**
   * Log error message
   */
  static error(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const formatted = this.formatMessage(LogLevel.ERROR, message, data);
    
    if (this.consoleOutput) {
      console.error(`${this.colors[LogLevel.ERROR]}${formatted}${this.colors.reset}`);
    }
    
    this.writeToFile(formatted);
  }

  /**
   * Log success message
   */
  static success(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.SUCCESS)) return;
    
    const formatted = this.formatMessage(LogLevel.SUCCESS, message, data);
    
    if (this.consoleOutput) {
      console.log(`${this.colors[LogLevel.SUCCESS]}${formatted}${this.colors.reset}`);
    }
    
    this.writeToFile(formatted);
  }

  /**
   * Create a transaction log
   */
  static transaction(txHash: string, action: string, data?: any): void {
    const message = `Transaction: ${action} | TX: ${txHash}`;
    this.info(message, data);
  }

  /**
   * Create a blockchain event log
   */
  static blockchainEvent(event: string, contract: string, data?: any): void {
    const message = `Blockchain Event: ${event} | Contract: ${contract}`;
    this.debug(message, data);
  }

  /**
   * Log performance metrics
   */
  static performance(operation: string, duration: number, data?: any): void {
    const message = `Performance: ${operation} took ${duration}ms`;
    
    if (duration > 1000) {
      this.warn(message, data);
    } else if (duration > 100) {
      this.info(message, data);
    } else {
      this.debug(message, data);
    }
  }

  /**
   * Log audit trail entry
   */
  static audit(action: string, user: string, entity: string, data?: any): void {
    const message = `Audit: ${action} | User: ${user} | Entity: ${entity}`;
    this.info(message, data);
  }

  /**
   * Get recent logs
   */
  static getRecentLogs(limit: number = 100): LogEntry[] {
    if (!this.logFile || !fs.existsSync(this.logFile)) {
      return [];
    }

    try {
      const content = fs.readFileSync(this.logFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      const logs: LogEntry[] = [];
      for (let i = Math.max(0, lines.length - limit); i < lines.length; i++) {
        const line = lines[i];
        
        // Parse log line (simplified)
        const match = line.match(/\[([^\]]+)\] \[([^\]]+)\] (.*)/);
        if (match) {
          const [, timestamp, level, message] = match;
          
          // Try to parse JSON data if present
          let data: any = undefined;
          const newlineIndex = message.indexOf('\n');
          if (newlineIndex > -1) {
            const messagePart = message.substring(0, newlineIndex);
            const dataPart = message.substring(newlineIndex + 1);
            try {
              data = JSON.parse(dataPart);
            } catch {
              data = dataPart;
            }
            
            logs.push({
              timestamp,
              level: level as LogLevel,
              message: messagePart,
              data
            });
          } else {
            logs.push({
              timestamp,
              level: level as LogLevel,
              message
            });
          }
        }
      }
      
      return logs;
    } catch (error) {
      this.error('Failed to read log file:', error);
      return [];
    }
  }

  /**
   * Clear log file
   */
  static clearLogs(): void {
    if (this.logFile && fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '', 'utf8');
      this.info('Log file cleared');
    }
  }

  /**
   * Set log level
   */
  static setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    this.info(`Log level set to: ${level}`);
  }

  /**
   * Enable/disable console output
   */
  static setConsoleOutput(enabled: boolean): void {
    this.consoleOutput = enabled;
    this.info(`Console output ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Enable/disable file output
   */
  static setFileOutput(enabled: boolean): void {
    this.fileOutput = enabled;
    this.info(`File output ${enabled ? 'enabled' : 'disabled'}`);
  }
}