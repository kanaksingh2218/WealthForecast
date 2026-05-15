import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction.model';
import { CategorizationService } from '../services/categorization.service';
import { CategoryCode } from 'wealthlens-shared';
import { generateTransactionHash } from '../utils/hash.utils';
import { CacheService } from '../services/cache.service';


export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.json({ success: true, data: [], meta: { page: 1, limit: 50, total: 0, totalPages: 0 } });

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const skip = (page - 1) * limit;

    const query: any = { userId };

    if (req.query.isTransfer === 'true') {
      query.isTransfer = true;
    } else if (req.query.isTransfer === 'false') {
      query.isTransfer = false;
    }

    if (req.query.dateFrom || req.query.dateTo) {
      query.date = {};
      if (req.query.dateFrom) query.date.$gte = new Date(req.query.dateFrom as string);
      if (req.query.dateTo) query.date.$lte = new Date(req.query.dateTo as string);
    }

    if (req.query.search) {
      const search = req.query.search as string;
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { merchantName: { $regex: search, $options: 'i' } },
      ];
    }

    if (req.query.isTransfer !== undefined) {
      query.isTransfer = req.query.isTransfer === 'true';
    } else {
      query.isTransfer = false;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: transactions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });

    const { category, subcategory, merchantName } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { category, subcategory, merchantName },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaction not found' } });
    }

    if (category) {
      await CategorizationService.learnRule(
        userId,
        transaction.description,
        category as CategoryCode,
        subcategory,
        merchantName
      );
    }

    // Invalidate analytics cache
    await CacheService.invalidatePattern(`wl:summary:${userId}:*`);
    await CacheService.invalidatePattern(`wl:categories:${userId}:*`);

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });

    const { date, description, amount, category, subcategory, merchantName } = req.body;
    
    // Simple manual entry hash
    const hash = generateTransactionHash(new Date(date), amount, description + '_manual_' + Date.now());

    const transaction = await Transaction.create({
      userId,
      date: new Date(date),
      description,
      amount,
      category: category || 'Uncategorized',
      subcategory,
      merchantName,
      source: 'manual',
      hash,
      isTransfer: false
    });

    // Invalidate analytics cache
    await CacheService.invalidatePattern(`wl:summary:${userId}:*`);
    await CacheService.invalidatePattern(`wl:categories:${userId}:*`);

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaction not found' } });
    }

    // Invalidate analytics cache
    await CacheService.invalidatePattern(`wl:summary:${userId}:*`);
    await CacheService.invalidatePattern(`wl:categories:${userId}:*`);

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};