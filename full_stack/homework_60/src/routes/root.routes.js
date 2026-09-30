import { Router } from 'express';
import { getRoot } from '../controllers/root.controller.js';

const router = Router();

router.get('/', getRoot);

export default router;
