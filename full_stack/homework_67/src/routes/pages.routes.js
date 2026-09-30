import { Router } from 'express';
import { statsPage } from '../controllers/stats.controller.js';
import { usersPage } from '../controllers/cursor.controller.js';

// Сторінки homework 67
const router = Router();

router.get('/stats', statsPage); // агрегації (PUG)
router.get('/cursor/users', usersPage); // пагінація курсором (PUG)

export default router;
