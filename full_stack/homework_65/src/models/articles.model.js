import { getCollection, COLLECTIONS } from '../db/mongo.js';
import { toObjectId } from '../utils/objectId.js';

const articles = () => getCollection(COLLECTIONS.articles);

const SORT_FIELDS = ['title', 'views', 'likes', 'publishedAt'];

/**
 * ?category=Backend&tag=express&author=Olena&q=mongo&sort=views&order=desc&limit=20&skip=0
 */
export const buildQuery = (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.tag) filter.tags = query.tag;
  if (query.author) filter.author = query.author;
  if (query.q) {
    const re = new RegExp(String(query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: re }, { content: re }];
  }

  const sortField = SORT_FIELDS.includes(query.sort) ? query.sort : 'publishedAt';
  const defaultOrder = sortField === 'title' ? 1 : -1;
  const order = query.order === 'asc' ? 1 : query.order === 'desc' ? -1 : defaultOrder;
  const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 100);
  const skip = Math.max(Number(query.skip) || 0, 0);

  return { filter, sort: { [sortField]: order }, limit, skip };
};

// READ: find() з проєкцією (без повного тексту для списку)
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
