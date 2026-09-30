import { Router } from 'express';
import {
  getUsers,
  postUsers,
  getUserById,
  putUserById,
  deleteUserById,
} from '../controllers/users.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validateNumericParam, validateUserBody } from '../middlewares/validation.js';

const router = Router();

// GET-маршрути публічні (сторінки відкриваються в браузері),
// змінюючі методи (POST/PUT/DELETE) вимагають Bearer-токен.
router.route('/').get(getUsers).post(authenticate, validateUserBody, postUsers);

router
  .route('/:userId')
  .all(validateNumericParam('userId'))
  .get(getUserById)
  .put(authenticate, validateUserBody, putUserById)
  .delete(authenticate, deleteUserById);

export default router;
