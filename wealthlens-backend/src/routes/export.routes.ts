import { Router } from 'express';
import { exportTransactions } from '../controllers/export.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/excel', exportTransactions);

export default router;
