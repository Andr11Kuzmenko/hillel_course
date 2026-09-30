import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/users.controller.js';
import { validateObjectId } from '../middlewares/validation.js';

const router = Router();

// homework 65 — лише READ-операції з MongoDB (створення/оновлення/видалення — у homework 66)
router.get('/', getUsers);
router.get('/:userId', validateObjectId('userId'), getUserById);

export default router;
