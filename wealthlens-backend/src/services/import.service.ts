import Papa from 'papaparse';
import ofx from 'node-ofx-parser';
import { parse, isValid } from 'date-fns';
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
    if (content.includes(',') && content.includes('\n')) {
      return 'CSV';
    }
    return 'UNKNOWN';
  }

  static getCSVHeaders(content: string): { headers: string[], startIndex: number } {
    const lines = content.split('\n');
    let startIndex = 0;

    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('date') && (line.includes('amount') || line.includes('description'))) {
        startIndex = i;
        const headers = lines[i].split(',').map(h => h.trim());
        return { headers, startIndex };
      }
    }

    const headers = lines[0].split(',').map(h => h.trim());
    return { headers, startIndex: 0 };
  }

  private static parseFlexibleDate(dateStr: any): Date {
    if (dateStr === null || dateStr === undefined || String(dateStr).trim() === '') {
      return new Date();
    }

    const cleanStr = String(dateStr).trim().replace(/\s+/g, ' ');

    const isoDate = new Date(cleanStr);
    if (isValid(isoDate) && isoDate.getFullYear() > 1900 && isoDate.getFullYear() < 2100) {
      return isoDate;
    }

    const formats = [
      'dd/MM/yyyy', 'dd-MM-yyyy', 'MM/dd/yyyy', 'MM-dd-yyyy',
      'yyyy/MM/dd', 'yyyy-MM-dd', 'dd MMM yyyy', 'MMM dd, yyyy',
      'dd/MM/yy', 'dd-MM-yy', 'd/M/yyyy', 'd-M-yyyy',
      'dd.MM.yyyy', 'dd.MM.yy'
    ];

    for (const fmt of formats) {
      try {
        const parsed = parse(cleanStr, fmt, new Date());
        if (isValid(parsed) && parsed.getFullYear() > 1900 && parsed.getFullYear() < 2100) {
          return parsed;
        }
      } catch (e) { }
    }

    const parts = cleanStr.split(/[\/\-\.]/);
    if (parts.length === 3) {
      const d = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const y = parts[2].length === 2 ? 2000 + parseInt(parts[2]) : parseInt(parts[2]);
      const manualDate = new Date(y, m, d);
      if (isValid(manualDate) && y > 1900 && y < 2100) return manualDate;
    }

    console.warn(`[Import] Failed to parse date string: "${dateStr}". Defaulting to current date.`);
    return new Date();
  }


  static async parseCSV(
    buffer: Buffer,
    mapping: Record<string, string>,
    userId: string
  ): Promise<ImportPreviewRow[]> {
    const content = buffer.toString('utf-8');
    const { startIndex } = this.getCSVHeaders(content);

    const lines = content.split('\n');
    const cleanedContent = lines.slice(startIndex).join('\n');
    const { data } = Papa.parse(cleanedContent, { header: true, skipEmptyLines: true });

    const previewRows: ImportPreviewRow[] = [];
    const occurrenceMap: Record<string, number> = {};

    for (const row of data as any[]) {
      try {
        const dateStr = row[mapping.date];
        const date = this.parseFlexibleDate(dateStr);

        const amount = row[mapping.amount]?.replace(/[^0-9.-]+/g, '') || '0.00';
        const description = row[mapping.description] || '';

        const comboKey = `${date.toISOString().split('T')[0]}|${amount}|${description.toLowerCase().trim()}`;
        const occurrence = occurrenceMap[comboKey] || 0;
        occurrenceMap[comboKey] = occurrence + 1;

        const hash = generateTransactionHash(date, amount, description, occurrence);
        const catResult = await CategorizationService.categorize(userId, description, row[mapping.merchantName]);
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
      } catch (err) {
        console.warn('Skipping row due to error:', err);
      }
    }


    return previewRows;
  }

  static async parseOFX(buffer: Buffer, userId: string): Promise<ImportPreviewRow[]> {
    const content = buffer.toString('utf-8');
    const data = ofx.parse(content);

    const stmtTrn = data?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN;
    const transactions = Array.isArray(stmtTrn) ? stmtTrn : [stmtTrn].filter(Boolean);

    const previewRows: ImportPreviewRow[] = [];
    const occurrenceMap: Record<string, number> = {};

    for (const trn of transactions) {
      const dateStr = trn.DTPOSTED || '';
      const date = new Date(
        `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
      );

      const amount = trn.TRNAMT || '0.00';
      const description = trn.NAME || trn.MEMO || '';

      const comboKey = `${date.toISOString().split('T')[0]}|${amount}|${description.toLowerCase().trim()}`;
      const occurrence = occurrenceMap[comboKey] || 0;
      occurrenceMap[comboKey] = occurrence + 1;

      const hash = generateTransactionHash(date, amount, description, occurrence);

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
