import { AppError, ErrorCode } from '../middleware/error.middleware';

export class SecurityService {

  static async scanFile(buffer: Buffer): Promise<void> {
    const isMalicious = false;

    if (isMalicious) {
      throw new AppError(ErrorCode.FORBIDDEN, 'File is malicious and has been quarantined', 403);
    }
  }

  static validateMagicBytes(buffer: Buffer): 'CSV' | 'OFX' {
    const header = buffer.slice(0, 100).toString('utf-8').trim();

    if (header.startsWith('<OFX') || header.startsWith('OFXHEADER')) {
      return 'OFX';
    }

    if (header.includes(',') || header.includes('\n') || header.includes('\r')) {
      return 'CSV';
    }

    throw new AppError(ErrorCode.INVALID_FILE_FORMAT, 'Invalid file format: Magic bytes not recognized', 400);
  }
}
