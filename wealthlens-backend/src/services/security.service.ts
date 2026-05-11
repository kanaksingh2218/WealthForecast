import { AppError, ErrorCode } from '../middleware/error.middleware';

export class SecurityService {
  /**
   * Mock ClamAV scan. In production, this would use a clamav client.
   */
  static async scanFile(buffer: Buffer): Promise<void> {
    // Simulate scan
    const isMalicious = false; // Mock result
    
    if (isMalicious) {
      throw new AppError(ErrorCode.FORBIDDEN, 'File is malicious and has been quarantined', 403);
    }
  }

  static validateMagicBytes(buffer: Buffer): 'CSV' | 'OFX' {
    const header = buffer.slice(0, 100).toString('utf-8').trim();
    
    if (header.startsWith('<OFX') || header.startsWith('OFXHEADER')) {
      return 'OFX';
    }
    
    // Check if it looks like a CSV (at least one comma and one newline in the first 100 bytes)
    // or just assume CSV if it's text-like and doesn't match OFX
    if (header.includes(',') || header.includes('\n') || header.includes('\r')) {
      return 'CSV';
    }

    throw new AppError(ErrorCode.INVALID_FILE_FORMAT, 'Invalid file format: Magic bytes not recognized', 400);
  }
}
