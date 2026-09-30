import { getCollection, COLLECTIONS } from '../db/mongo.js';
import { toObjectId } from '../utils/objectId.js';

const users = () => getCollection(COLLECTIONS.users);

const SORT_FIELDS = ['name', 'age', 'city', 'createdAt'];

/**
 * Будує фільтр/сортування з query-параметрів:
 * ?city=Kyiv&role=admin&minAge=20&maxAge=40&q=olena&sort=age&order=desc&limit=20&skip=0
 */
export const buildQuery = (query = {}) => {
  const filter = {};
  if (query.city) filter.city = query.city;
  if (query.role) filter.role = query.role;
  if (query.minAge || query.maxAge) {
    filter.age = {};
    if (query.minAge) filter.age.$gte = Number(query.minAge);
    if (query.maxAge) filter.age.$lte = Number(query.maxAge);
  }
  if (query.q) {
    const re = new RegExp(String(query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: re }, { email: re }];
  }

  const sortField = SORT_FIELDS.includes(query.sort) ? query.sort : 'name';
  const sort = { [sortField]: query.order === 'desc' ? -1 : 1 };
  const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 100);
  const skip = Math.max(Number(query.skip) || 0, 0);

  return { filter, sort, limit, skip };
};

// READ: find() з фільтром, сортуванням і пагінацією
export const findAll = ({ filter = {}, sort = { name: 1 }, limit = 50, skip = 0 } = {}) =>
  users().find(filter).sort(sort).skip(skip).limit(limit).toArray();

// READ: findOne() за _id
export const findById = (id) => users().findOne({ _id: toObjectId(id, 'userId') });

// READ: countDocuments()
export const count = (filter = {}) => users().countDocuments(filter);

// READ: distinct() — список міст для фільтра
export const distinctCities = () => users().distinct('city');
