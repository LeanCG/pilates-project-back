import { Router } from 'express';
import { ProgressController } from '../controllers/progressController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/my-progress', authenticate, ProgressController.getMyProgress);
router.get('/my-progress/latest', authenticate, ProgressController.getLatestProgress);
router.get('/my-progress/history', authenticate, ProgressController.getHistoryProgress);
router.get('/progress', authenticate, authorize('admin', 'instructor'), ProgressController.getAllProgress);
router.get('/progress/cliente/:clienteId', authenticate, authorize('admin', 'instructor'), ProgressController.getProgressByClient);
router.post('/progress', authenticate, ProgressController.createProgress);
router.put('/progress/:id', authenticate, ProgressController.updateProgress);
router.delete('/progress/:id', authenticate, authorize('admin', 'instructor'), ProgressController.deleteProgress);

export default router;
