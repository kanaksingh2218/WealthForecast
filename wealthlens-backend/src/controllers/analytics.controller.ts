import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction.model';
import { getMonthlySummaryPipeline } from '../aggregations/monthlySummary.agg';
import { getCategoryBreakdownPipeline } from '../aggregations/categoryBreakdown.agg';

export const getMonthlySummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const pipeline = getMonthlySummaryPipeline(String(userId));
    const data = await Transaction.aggregate(pipeline as any);
    res.json({ success: true, data: data || [] });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { dateFrom, dateTo } = req.query;
    const pipeline = getCategoryBreakdownPipeline(
      String(userId),
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );
    const data = await Transaction.aggregate(pipeline as any);
    res.json({ success: true, data: data || [] });
  } catch (error) {
    next(error);
  }
};

export const getTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};