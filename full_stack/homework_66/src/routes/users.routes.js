import { Router } from 'express';
import * as ctrl from '../controllers/users.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validateObjectId, validateBody, validateBulk, validateUpdateMany } from '../middlewares/validation.js';
import { validateUser } from '../validators/user.validator.js';
import { buildFilter } from '../models/users.model.js';

const router = Router();

// READ — публічні сторінки (PUG)
router.get('/', ctrl.getUsers);

// CREATE / UPDATE / DELETE — вимагають входу (Passport-сесія) або Authorization: Bearer <API_TOKEN>
router.post('/', authenticate, validateBody(validateUser), ctrl.createUser); // insertOne
router.post('/bulk', authenticate, validateBulk(validateUser), ctrl.createUsers); // insertMany
router.patch('/', authenticate, validateUpdateMany(validateUser, buildFilter), ctrl.updateUsers); // updateMany
router.delete('/', authenticate, ctrl.deleteUsers); // deleteMany

router
  .route('/:userId')
  .all(validateObjectId('userId'))
  .get(ctrl.getUserById)
  .patch(authenticate, validateBody(validateUser, { partial: true }), ctrl.updateUser) // updateOne
  .put(authenticate, validateBody(validateUser), ctrl.replaceUser) // replaceOne
  .delete(authenticate, ctrl.deleteUser); // deleteOne

export default router;
