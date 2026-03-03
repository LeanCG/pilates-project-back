import { Router } from 'express';
import { DebtController } from '../controllers/debtController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/my-debts', authenticate, DebtController.getMyDebts);
router.get('/my-debts/summary', authenticate, DebtController.getMyDebtSummary);
router.get('/debts', authenticate, authorize('admin', 'instructor'), DebtController.getAllDebts);
router.get('/debts/pending', authenticate, authorize('admin', 'instructor'), DebtController.getPendingDebts);
router.post('/debts', authenticate, authorize('admin'), DebtController.createDebt);
router.put('/debts/:id/pay', authenticate, authorize('admin', 'instructor', 'cliente'), DebtController.payDebt);
router.put('/debts/:id/cancel', authenticate, authorize('admin'), DebtController.cancelDebt);

export default router;
