import { Router } from 'express';
import { health, listUsers, getUser, listArticles, getArticle } from '../controllers/api.controller.js';
import { validateObjectId } from '../middlewares/validation.js';

// JSON API (READ-операції)
const router = Router();

router.get('/health', health);
router.get('/users', listUsers);
router.get('/users/:userId', validateObjectId('userId'), getUser);
router.get('/articles', listArticles);
router.get('/articles/:articleId', validateObjectId('articleId'), getArticle);

export default router;
