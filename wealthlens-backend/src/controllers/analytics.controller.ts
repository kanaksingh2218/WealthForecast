import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction.model';
import { getMonthlySummaryPipeline } from '../aggregations/monthlySummary.agg';
import { getCategoryBreakdownPipeline } from '../aggregations/categoryBreakdown.agg';
import { getTrendPipeline } from '../aggregations/trend.agg';
import { CacheService } from '../services/cache.service';

export const getMonthlySummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'default_user';
    const cacheKey = CacheService.generateKey(userId, 'summary');

    const cached = await CacheService.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const pipeline = getMonthlySummaryPipeline(userId);
    const data = await Transaction.aggregate(pipeline as any);

    await CacheService.set(cacheKey, data);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'default_user';
    const { dateFrom, dateTo } = req.query;
    const cacheKey = CacheService.generateKey(userId, 'categories', { dateFrom, dateTo });

    const cached = await CacheService.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const pipeline = getCategoryBreakdownPipeline(
      userId,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );
    const data = await Transaction.aggregate(pipeline as any);

    await CacheService.set(cacheKey, data);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'default_user';
    const { category } = req.query;
    const cacheKey = CacheService.generateKey(userId, 'trend', { category });

    const cached = await CacheService.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const pipeline = getTrendPipeline(userId, category as string);
    const data = await Transaction.aggregate(pipeline as any);

    await CacheService.set(cacheKey, data);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
