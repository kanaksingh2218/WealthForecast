import { Router } from 'express';
import { computeForecast, getScenarios, createScenario, deleteScenario } from '../controllers/forecast.controller';

const router = Router();

router.post('/compute', computeForecast);
router.get('/scenarios', getScenarios);
router.post('/scenarios', createScenario);
router.delete('/scenarios/:id', deleteScenario);

export default router;
