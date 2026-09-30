import * as User from '../models/users.model.js';
import * as Article from '../models/articles.model.js';
import { getDb } from '../db/mongo.js';
import { HttpError } from '../utils/HttpError.js';

// GET /api/health — перевірка з'єднання з БД
export const health = async (req, res) => {
  const started = Date.now();
  await getDb().command({ ping: 1 });
  res.json({ status: 'ok', db: getDb().databaseName, pingMs: Date.now() - started });
};

export const listUsers = async (req, res) => {
  const query = User.buildQuery(req.query);
  const [items, total] = await Promise.all([User.findAll(query), User.count(query.filter)]);
  res.json({ total, count: items.length, skip: query.skip, limit: query.limit, items });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new HttpError(404, `User ${req.params.userId} not found`);
  res.json(user);
};

export const listArticles = async (req, res) => {
  const query = Article.buildQuery(req.query);
  const [items, total] = await Promise.all([Article.findAll(query), Article.count(query.filter)]);
  res.json({ total, count: items.length, skip: query.skip, limit: query.limit, items });
};

export const getArticle = async (req, res) => {
  const article = await Article.findById(req.params.articleId);
  if (!article) throw new HttpError(404, `Article ${req.params.articleId} not found`);
  res.json(article);
};
