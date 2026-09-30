import { Router } from 'express';
import { getSession, destroySession } from '../controllers/session.controller.js';

const router = Router();

router.get('/', getSession);
router.delete('/', destroySession);

export default router;
