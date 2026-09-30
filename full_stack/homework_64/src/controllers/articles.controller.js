import * as Article from '../models/articles.model.js';
import { HttpError } from '../utils/HttpError.js';

const wantsJson = (req) => req.accepts(['html', 'json']) === 'json';

// GET /articles — список (EJS)
export const getArticles = (req, res) => {
  const articles = Article.findAll();
  if (wantsJson(req)) return res.json(articles);
  res.render('articles/list.ejs', { title: 'Articles', articles });
};

// GET /articles/:articleId — деталі (EJS)
export const getArticleById = (req, res, next) => {
  const article = Article.findById(req.params.articleId);
  if (!article) return next(new HttpError(404, `Article ${req.params.articleId} not found`));
  if (wantsJson(req)) return res.json(article);
  res.render('articles/detail.ejs', { title: article.title, article });
};

export const postArticles = (req, res) => {
  const article = Article.create(req.body);
  res.status(201).json(article);
};

export const putArticleById = (req, res, next) => {
  const article = Article.update(req.params.articleId, req.body);
  if (!article) return next(new HttpError(404, `Article ${req.params.articleId} not found`));
  res.json(article);
};

export const deleteArticleById = (req, res, next) => {
  const article = Article.remove(req.params.articleId);
  if (!article) return next(new HttpError(404, `Article ${req.params.articleId} not found`));
  res.json({ message: `Article ${article.id} deleted`, article });
};
