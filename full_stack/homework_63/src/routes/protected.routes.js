import { Router } from 'express';
import { protectedPage } from '../controllers/auth.controller.js';
import { requireJwt } from '../middlewares/jwtAuth.js';

const router = Router();

router.get('/', requireJwt, protectedPage);

export default router;
