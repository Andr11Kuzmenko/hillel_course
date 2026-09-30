import { Router } from 'express';
import { getArticles, getArticleById } from '../controllers/articles.controller.js';
import { checkArticleAccess } from '../middlewares/access.js';
import { validateObjectId } from '../middlewares/validation.js';

const router = Router();

// Перевірка прав доступу (для GET без заголовка X-User-Role роль = reader)
router.use(checkArticleAccess);

// homework 65 — лише READ-операції з MongoDB
router.get('/', getArticles);
router.get('/:articleId', validateObjectId('articleId'), getArticleById);

export default router;
