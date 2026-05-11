import { Router } from 'express';
import { getMonthlySummary, getCategoryBreakdown, getTrend } from '../controllers/analytics.controller';

const router = Router();

router.get('/summary', getMonthlySummary);
router.get('/categories', getCategoryBreakdown);
router.get('/trend', getTrend);

export default router;
