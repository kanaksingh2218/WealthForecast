import { Router } from 'express';
import { getTransactions, updateTransaction } from '../controllers/transactions.controller';

const router = Router();

router.get('/', getTransactions);
router.patch('/:id', updateTransaction);

export default router;
