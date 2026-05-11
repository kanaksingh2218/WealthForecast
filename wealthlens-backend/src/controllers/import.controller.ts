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

    const userId = (req as any).user?.id || 'default_user';
    
    // 1. ClamAV Scan (mocked)
    await SecurityService.scanFile(req.file.buffer);

    // 2. Magic Byte Validation
    const format = SecurityService.validateMagicBytes(req.file.buffer);

    if (format === 'CSV' && !req.body.mapping) {
      // If CSV and no mapping, return sample rows for UI mapper
      const content = req.file.buffer.toString('utf-8');
      // Just return first 5 rows and headers
      const lines = content.split('\n').slice(0, 6);
      return res.json({
        success: true,
        data: {
          format: 'CSV',
          needsMapping: true,
          sample: lines,
          headers: lines[0].split(','),
        },
      });
    }

    let previewRows;
    if (format === 'CSV') {
      const mapping = JSON.parse(req.body.mapping);
      previewRows = await ImportService.parseCSV(req.file.buffer, mapping, userId);
    } else {
      previewRows = await ImportService.parseOFX(req.file.buffer, userId);
    }

    res.json({
      success: true,
      data: {
        format,
        needsMapping: false,
        transactions: previewRows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmImport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactions } = req.body;
    const userId = (req as any).user?.id || 'default_user';

    if (!Array.isArray(transactions)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Transactions array required' } });
    }

    // Filter out duplicates and invalid ones
    const toSave = transactions
      .filter((t: any) => !t.isDuplicate)
      .map((t: any) => ({
        ...t,
        userId,
      }));

    if (toSave.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'DUPLICATE_TRANSACTIONS', message: 'All transactions are duplicates' } });
    }

    const saved = await Transaction.insertMany(toSave);

    // Invalidate analytics cache
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
