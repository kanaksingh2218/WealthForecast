import { Router } from 'express';
import { getSubscriptions } from '../controllers/subscription.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getSubscriptions);

export default router;
