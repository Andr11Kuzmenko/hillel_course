import * as Article from '../models/articles.model.js';
import { HttpError } from '../utils/HttpError.js';

const wantsJson = (req) => req.accepts(['html', 'json']) === 'json';
const notFound = (id) => new HttpError(404, `Article ${id} not found`);

// ---------- READ (EJS) ----------
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

export const getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.articleId);
  if (!article) throw notFound(req.params.articleId);

  if (wantsJson(req)) return res.json(article);
  res.render('articles/detail.ejs', { title: article.title, article });
};

// ---------- CREATE ----------
export const createArticle = async (req, res) => {
  const article = await Article.insertOne(req.validated);
  res
    .status(201)
    .location(`/articles/${article._id}`)
    .json({ operation: 'insertOne', insertedId: article._id, item: article });
};

export const createArticles = async (req, res) => {
  const result = await Article.insertMany(req.validated);
  res.status(201).json({ operation: 'insertMany', ...result });
};

// ---------- UPDATE ----------
export const updateArticle = async (req, res) => {
  const { matchedCount, modifiedCount } = await Article.updateOne(req.params.articleId, req.validated);
  if (!matchedCount) throw notFound(req.params.articleId);
  const item = await Article.findById(req.params.articleId);
  res.json({ operation: 'updateOne', matchedCount, modifiedCount, item });
};

// POST /articles/:articleId/like — updateOne з $inc
export const likeArticle = async (req, res) => {
  const { matchedCount } = await Article.incrementLikes(req.params.articleId);
  if (!matchedCount) throw notFound(req.params.articleId);
  const item = await Article.findById(req.params.articleId);
  if (req.is('urlencoded')) return res.redirect(`/articles/${req.params.articleId}`);
  res.json({ operation: 'updateOne ($inc)', likes: item.likes });
};

export const updateArticles = async (req, res) => {
  const { filter, update } = req.validated;
  const { matchedCount, modifiedCount } = await Article.updateMany(filter, update);
  res.json({ operation: 'updateMany', filter, matchedCount, modifiedCount });
};

export const replaceArticle = async (req, res) => {
  const { matchedCount, modifiedCount } = await Article.replaceOne(req.params.articleId, req.validated);
  if (!matchedCount) throw notFound(req.params.articleId);
  const item = await Article.findById(req.params.articleId);
  res.json({ operation: 'replaceOne', matchedCount, modifiedCount, item });
};

// ---------- DELETE ----------
export const deleteArticle = async (req, res) => {
  const { deletedCount } = await Article.deleteOne(req.params.articleId);
  if (!deletedCount) throw notFound(req.params.articleId);
  res.json({ operation: 'deleteOne', deletedCount });
};

export const deleteArticles = async (req, res) => {
  const filter = Article.buildFilter(req.query);
  if (!Object.keys(filter).length) {
    throw new HttpError(400, 'deleteMany requires at least one filter: category, tag, author, published or q');
  }
  const { deletedCount } = await Article.deleteMany(filter);
  res.json({ operation: 'deleteMany', filter: req.query, deletedCount });
};
