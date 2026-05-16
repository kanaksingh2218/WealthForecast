import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service';

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const subscriptions = await SubscriptionService.detect(userId);
    
    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
