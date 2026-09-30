import { Router } from 'express';
import * as ctrl from '../controllers/articles.controller.js';
import { checkArticleAccess } from '../middlewares/access.js';
import { validateObjectId, validateBody, validateBulk, validateUpdateMany } from '../middlewares/validation.js';
import { validateArticle } from '../validators/article.validator.js';
import { buildFilter } from '../models/articles.model.js';

const router = Router();

// Лайк доступний усім (кнопка на сторінці статті) — оголошено до перевірки ролей
router.post('/:articleId/like', validateObjectId('articleId'), ctrl.likeArticle); // updateOne + $inc

// Права доступу за заголовком X-User-Role:
// GET — reader/editor/admin (за замовчуванням reader), POST/PUT/PATCH — editor/admin, DELETE — admin
router.use(checkArticleAccess);

router.get('/', ctrl.getArticles);
router.post('/', validateBody(validateArticle), ctrl.createArticle); // insertOne
router.post('/bulk', validateBulk(validateArticle), ctrl.createArticles); // insertMany
router.patch('/', validateUpdateMany(validateArticle, buildFilter), ctrl.updateArticles); // updateMany
router.delete('/', ctrl.deleteArticles); // deleteMany

router
  .route('/:articleId')
  .all(validateObjectId('articleId'))
  .get(ctrl.getArticleById)
  .patch(validateBody(validateArticle, { partial: true }), ctrl.updateArticle) // updateOne
  .put(validateBody(validateArticle), ctrl.replaceArticle) // replaceOne
  .delete(ctrl.deleteArticle); // deleteOne

export default router;
