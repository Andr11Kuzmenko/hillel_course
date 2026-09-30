import { Router } from 'express';
import {
  getArticles,
  postArticles,
  getArticleById,
  putArticleById,
  deleteArticleById,
} from '../controllers/articles.controller.js';

const router = Router();

router.route('/').get(getArticles).post(postArticles);
router
  .route('/:articleId')
  .get(getArticleById)
  .put(putArticleById)
  .delete(deleteArticleById);

export default router;
