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

// Аутентифікація для всіх маршрутів /users
router.use(authenticate);

router.route('/').get(getUsers).post(validateUserBody, postUsers);

router
  .route('/:userId')
  .all(validateNumericParam('userId'))
  .get(getUserById)
  .put(validateUserBody, putUserById)
  .delete(deleteUserById);

export default router;
