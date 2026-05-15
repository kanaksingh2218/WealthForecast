import { Router } from 'express';
import { getTransactions, updateTransaction, createTransaction, deleteTransaction } from '../controllers/transactions.controller';

import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
export default router;