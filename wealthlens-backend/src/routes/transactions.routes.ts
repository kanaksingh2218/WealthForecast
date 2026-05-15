import { Router } from 'express';
import { getTransactions, updateTransaction } from '../controllers/transactions.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/', getTransactions);
router.patch('/:id', updateTransaction);
export default router;