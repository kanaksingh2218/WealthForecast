import Papa from 'papaparse';
import ofx from 'node-ofx-parser';
import { Transaction as ITransaction, ImportSource } from 'wealthlens-shared';
import { generateTransactionHash } from '../utils/hash.utils';
import { Transaction } from '../models/Transaction.model';
import { CategorizationService } from './categorization.service';

export interface ImportPreviewRow extends Partial<ITransaction> {
  isDuplicate: boolean;
  confidence: number;
}

export class ImportService {
  static detectFormat(buffer: Buffer): 'CSV' | 'OFX' | 'UNKNOWN' {
    const content = buffer.toString('utf-8').trim();
    if (content.startsWith('<OFX') || content.startsWith('OFXHEADER')) {
      return 'OFX';
    }
    // Simple CSV check: contains commas and newlines
    if (content.includes(',') && content.includes('\n')) {
      return 'CSV';
    }
    return 'UNKNOWN';
  }

  static async parseCSV(
    buffer: Buffer,
    mapping: Record<string, string>,
    userId: string
  ): Promise<ImportPreviewRow[]> {
    const content = buffer.toString('utf-8');
    const { data } = Papa.parse(content, { header: true, skipEmptyLines: true });

    const previewRows: ImportPreviewRow[] = [];

    for (const row of data as any[]) {
      const date = new Date(row[mapping.date]);
      const amount = row[mapping.amount]?.replace(/[^0-9.-]+/g, '') || '0.00';
      const description = row[mapping.description] || '';
      
      const hash = generateTransactionHash(date, amount, description);
      
      // Categorize
      const catResult = await CategorizationService.categorize(userId, description, row[mapping.merchantName]);

      // Check for duplicate in DB
      const existing = await Transaction.findOne({ userId, hash });

      previewRows.push({
        date,
        amount,
        description,
        merchantName: catResult.merchantName || row[mapping.merchantName] || '',
        category: catResult.category,
        subcategory: catResult.subcategory,
        source: 'csv',
        hash,
        isTransfer: false,
        isDuplicate: !!existing,
        confidence: catResult.confidence,
      });
    }

    return previewRows;
  }

  static async parseOFX(buffer: Buffer, userId: string): Promise<ImportPreviewRow[]> {
    const content = buffer.toString('utf-8');
    const data = ofx.parse(content);
    
    // OFX structure varies, but typically: OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN
    const stmtTrn = data?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN;
    const transactions = Array.isArray(stmtTrn) ? stmtTrn : [stmtTrn].filter(Boolean);

    const previewRows: ImportPreviewRow[] = [];

    for (const trn of transactions) {
      // OFX date format: YYYYMMDDHHMMSS
      const dateStr = trn.DTPOSTED || '';
      const date = new Date(
        `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
      );
      
      const amount = trn.TRNAMT || '0.00';
      const description = trn.NAME || trn.MEMO || '';
      const hash = generateTransactionHash(date, amount, description);

      const catResult = await CategorizationService.categorize(userId, description);
      const existing = await Transaction.findOne({ userId, hash });

      previewRows.push({
        date,
        amount,
        description,
        merchantName: catResult.merchantName || '',
        category: catResult.category,
        subcategory: catResult.subcategory,
        source: 'ofx',
        hash,
        isTransfer: false,
        isDuplicate: !!existing,
        confidence: catResult.confidence,
      });
    }

    return previewRows;
  }
}
