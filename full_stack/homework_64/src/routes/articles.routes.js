import { Router } from 'express';
import {
  getArticles,
  postArticles,
  getArticleById,
  putArticleById,
  deleteArticleById,
} from '../controllers/articles.controller.js';
import { checkArticleAccess } from '../middlewares/access.js';
import { validateNumericParam, validateArticleBody } from '../middlewares/validation.js';

const router = Router();

// Перевірка прав доступу для всіх маршрутів /articles
router.use(checkArticleAccess);

router.route('/').get(getArticles).post(validateArticleBody, postArticles);

router
  .route('/:articleId')
  .all(validateNumericParam('articleId'))
  .get(getArticleById)
  .put(validateArticleBody, putArticleById)
  .delete(deleteArticleById);

export default router;
