import { getCollection, COLLECTIONS } from '../db/mongo.js';
import { toObjectId } from '../utils/objectId.js';
import { articleDefaults } from '../validators/article.validator.js';

const articles = () => getCollection(COLLECTIONS.articles);

const SORT_FIELDS = ['title', 'views', 'likes', 'publishedAt'];
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Whitelist-фільтр: { category, tag, author, q, published }.
 */
export const buildFilter = (params = {}) => {
  const filter = {};
  if (typeof params.category === 'string' && params.category) filter.category = params.category;
  if (typeof params.tag === 'string' && params.tag) filter.tags = params.tag;
  if (typeof params.author === 'string' && params.author) filter.author = params.author;
  if (params.published === true || params.published === 'true') filter.published = true;
  if (params.published === false || params.published === 'false') filter.published = false;
  if (typeof params.q === 'string' && params.q) {
    const re = new RegExp(escapeRe(params.q), 'i');
    filter.$or = [{ title: re }, { content: re }];
  }
  return filter;
};

/**
 * ?category=Backend&tag=express&author=Olena&q=mongo&sort=views&order=desc&limit=20&skip=0
 */
export const buildQuery = (query = {}) => {
  const sortField = SORT_FIELDS.includes(query.sort) ? query.sort : 'publishedAt';
  const defaultOrder = sortField === 'title' ? 1 : -1;
  const order = query.order === 'asc' ? 1 : query.order === 'desc' ? -1 : defaultOrder;
  return {
    filter: buildFilter(query),
    sort: { [sortField]: order },
    limit: Math.min(Math.max(Number(query.limit) || 50, 1), 100),
    skip: Math.max(Number(query.skip) || 0, 0),
  };
};

// ---------- READ ----------
export const findAll = ({ filter = {}, sort = { publishedAt: -1 }, limit = 50, skip = 0 } = {}) =>
  articles()
    .find(filter, { projection: { content: 0 } })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

export const findById = (id) => articles().findOne({ _id: toObjectId(id, 'articleId') });

export const count = (filter = {}) => articles().countDocuments(filter);

export const distinctCategories = () => articles().distinct('category');

// ---------- CREATE ----------
export const insertOne = async (data) => {
  const doc = { ...articleDefaults(), ...data, createdAt: new Date() };
  const { insertedId } = await articles().insertOne(doc);
  return { _id: insertedId, ...doc };
};

export const insertMany = async (items) => {
  const now = new Date();
  const docs = items.map((item) => ({ ...articleDefaults(), ...item, createdAt: now }));
  const result = await articles().insertMany(docs);
  return { insertedCount: result.insertedCount, insertedIds: Object.values(result.insertedIds) };
};

// ---------- UPDATE ----------
export const updateOne = (id, data) =>
  articles().updateOne({ _id: toObjectId(id, 'articleId') }, { $set: { ...data, updatedAt: new Date() } });

// updateOne з оператором $inc — лайк статті
export const incrementLikes = (id, by = 1) =>
  articles().updateOne({ _id: toObjectId(id, 'articleId') }, { $inc: { likes: by } });

export const updateMany = (filter, data) =>
  articles().updateMany(filter, { $set: { ...data, updatedAt: new Date() } });

export const replaceOne = async (id, data) => {
  const _id = toObjectId(id, 'articleId');
  const existing = await articles().findOne({ _id }, { projection: { createdAt: 1 } });
  if (!existing) return { matchedCount: 0, modifiedCount: 0 };
  return articles().replaceOne(
    { _id },
    { ...articleDefaults(), ...data, createdAt: existing.createdAt ?? new Date(), updatedAt: new Date() },
  );
};

// ---------- DELETE ----------
export const deleteOne = (id) => articles().deleteOne({ _id: toObjectId(id, 'articleId') });

export const deleteMany = (filter) => articles().deleteMany(filter);
