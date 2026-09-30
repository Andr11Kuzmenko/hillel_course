import { Router } from 'express';
import {
  getUsers,
  postUsers,
  getUserById,
  putUserById,
  deleteUserById,
} from '../controllers/users.controller.js';

const router = Router();

router.route('/').get(getUsers).post(postUsers);
router.route('/:userId').get(getUserById).put(putUserById).delete(deleteUserById);

export default router;
