import { Router } from 'express';
import { streamCollection, paginateCollection, summarizeUsers } from '../controllers/cursor.controller.js';

// Монтується на /api/cursor
const router = Router();

router.get('/users/summary', summarizeUsers);
router.get('/:collection/stream', streamCollection);
router.get('/:collection', paginateCollection);

export default router;
