import { Request, Response, NextFunction } from 'express';
import { ImportService } from '../services/import.service';
import { SecurityService } from '../services/security.service';
import { Transaction } from '../models/Transaction.model';
import { CacheService } from '../services/cache.service';

export const uploadImport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No file uploaded' } });
    }
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });

    await SecurityService.scanFile(req.file.buffer);
    const format = SecurityService.validateMagicBytes(req.file.buffer);

    if (format === 'CSV' && !req.body.mapping) {
      const content = req.file.buffer.toString('utf-8');
      const { headers, startIndex } = ImportService.getCSVHeaders(content);
      const lines = content.split('\n').slice(startIndex, startIndex + 6);
      
      return res.json({
        success: true,
        data: {
          format: 'CSV',
          needsMapping: true,
          sample: lines,
          headers: headers,
        },
      });
    }


    let previewRows;
    if (format === 'CSV') {
      const mapping = JSON.parse(req.body.mapping);
      console.log('[Import] Mapping received:', mapping);
      previewRows = await ImportService.parseCSV(req.file.buffer, mapping, userId);
    } else {
      previewRows = await ImportService.parseOFX(req.file.buffer, userId);
    }

    console.log(`[Import] Successfully parsed ${previewRows.length} rows. Sample date:`, previewRows[0]?.date);

    res.json({
      success: true,
      data: { format, needsMapping: false, transactions: previewRows },
    });

  } catch (error) {
    next(error);
  }
};

export const confirmImport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactions } = req.body;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });

    if (!Array.isArray(transactions)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Transactions array required' } });
    }

    const toSave = transactions
      .filter((t: any) => !t.isDuplicate)
      .map((t: any) => ({
        ...t,
        userId,
        currency: t.currency || 'INR',
        source: t.source || 'csv',
        isTransfer: t.isTransfer || false,
        category: t.category || 'Uncategorized',
        amount: String(t.amount || '0'),
      }));

    if (toSave.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'DUPLICATE_TRANSACTIONS', message: 'All transactions are duplicates' } });
    }

    const saved = await Transaction.insertMany(toSave, { ordered: false });

    await CacheService.invalidatePattern(`wl:summary:${userId}:*`);
    await CacheService.invalidatePattern(`wl:categories:${userId}:*`);

    res.json({
      success: true,
      message: `${saved.length} transactions imported successfully`,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};