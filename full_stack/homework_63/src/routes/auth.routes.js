import { Router } from 'express';
import { showRegister, showLogin, register, login, logout, me } from '../controllers/auth.controller.js';
import { requireJwt } from '../middlewares/jwtAuth.js';

const router = Router();

router.route('/register').get(showRegister).post(register);
router.route('/login').get(showLogin).post(login);
router.post('/logout', logout);
router.get('/logout', logout); // зручно для посилання в меню
router.get('/me', requireJwt, me);

export default router;
