import { Router } from 'express';
import { uploadImport, confirmImport } from '../controllers/import.controller';
import { upload } from '../config/multer';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadImport);
router.post('/confirm', confirmImport);

export default router;
