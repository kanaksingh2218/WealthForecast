import { Router } from 'express';
import { getMonthlySummary, getCategoryBreakdown, getTrend } from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/summary', getMonthlySummary);
router.get('/categories', getCategoryBreakdown);
router.get('/trend', getTrend);
export default router;