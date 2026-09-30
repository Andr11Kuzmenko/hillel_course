import { Router } from 'express';
import { getRoot } from '../controllers/root.controller.js';
import { logger } from '../middlewares/logger.js';

const router = Router();

router.get('/', logger, getRoot);

export default router;
