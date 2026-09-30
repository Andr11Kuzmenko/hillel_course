import { Router } from 'express';
import { showRegister, showLogin, register, login, logout } from '../controllers/auth.controller.js';
import { ensureGuest } from '../middlewares/ensureAuthenticated.js';

const router = Router();

router.route('/register').get(ensureGuest, showRegister).post(register);
router.route('/login').get(ensureGuest, showLogin).post(login);
router.post('/logout', logout);
router.get('/logout', logout); // зручно для посилання в меню

export default router;
