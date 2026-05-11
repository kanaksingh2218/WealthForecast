import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction.model';
import { CategorizationService } from '../services/categorization.service';
import { CategoryCode } from 'wealthlens-shared';

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'default_user';
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const skip = (page - 1) * limit;

    const query: any = { userId };

    // Filtering
    if (req.query.category) {
      const categories = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
      query.category = { $in: categories };
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
      query.isTransfer = false; // Default: exclude transfers
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: transactions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || 'default_user';
    const { category, subcategory, merchantName } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { category, subcategory, merchantName },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaction not found' } });
    }

    // Learn rule if category is provided
    if (category) {
      await CategorizationService.learnRule(
        userId,
        transaction.description, // Use description as pattern
        category as CategoryCode,
        subcategory,
        merchantName
      );
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};
