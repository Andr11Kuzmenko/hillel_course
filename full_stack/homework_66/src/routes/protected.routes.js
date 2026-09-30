import { Router } from 'express';
import { profile, protectedPage } from '../controllers/auth.controller.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const router = Router();

// Маршрути доступні лише після входу (ensureAuthenticated підключено до кожного маршруту,
// щоб роутер, змонтований на '/', не перехоплював невідомі шляхи замість 404)
router.get('/profile', ensureAuthenticated, profile);
router.get('/protected', ensureAuthenticated, protectedPage);

export default router;
