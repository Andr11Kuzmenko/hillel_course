import { Router } from 'express';
import { listReports, getReport } from '../controllers/stats.controller.js';

// Монтується на /api/stats
const router = Router();

router.get('/', listReports);
router.get('/:name', getReport);

export default router;
