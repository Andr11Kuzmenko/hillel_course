import * as Article from '../models/articles.model.js';
import { HttpError } from '../utils/HttpError.js';

const wantsJson = (req) => req.accepts(['html', 'json']) === 'json';

// GET /articles — список статей з MongoDB (EJS)
export const getArticles = async (req, res) => {
  const query = Article.buildQuery(req.query);
  const [articles, total, categories] = await Promise.all([
    Article.findAll(query),
    Article.count(query.filter),
    Article.distinctCategories(),
  ]);

  if (wantsJson(req)) return res.json({ total, count: articles.length, items: articles });
  res.render('articles/list.ejs', { title: 'Articles', articles, total, categories: categories.sort(), query: req.query });
};

// GET /articles/:articleId — деталі (EJS)
export const getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.articleId);
  if (!article) throw new HttpError(404, `Article ${req.params.articleId} not found`);

  if (wantsJson(req)) return res.json(article);
  res.render('articles/detail.ejs', { title: article.title, article });
};
