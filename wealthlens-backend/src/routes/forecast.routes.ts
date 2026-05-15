import { Router } from 'express';
import { computeForecast, getScenarios, createScenario, deleteScenario } from '../controllers/forecast.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.post('/compute', computeForecast);
router.get('/scenarios', getScenarios);
router.post('/scenarios', createScenario);
router.delete('/scenarios/:id', deleteScenario);
export default router;