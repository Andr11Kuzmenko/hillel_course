import { getCollection, COLLECTIONS } from '../db/mongo.js';
import { toObjectId } from '../utils/objectId.js';

const users = () => getCollection(COLLECTIONS.users);

const SORT_FIELDS = ['name', 'age', 'city', 'createdAt'];
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Будує MongoDB-фільтр лише з дозволених полів (whitelist):
 * { city, role, minAge, maxAge, q }. Використовується для find, updateMany, deleteMany.
 */
export const buildFilter = (params = {}) => {
  const filter = {};
  if (typeof params.city === 'string' && params.city) filter.city = params.city;
  if (typeof params.role === 'string' && params.role) filter.role = params.role;
  const minAge = Number(params.minAge);
  const maxAge = Number(params.maxAge);
  if (params.minAge !== undefined && params.minAge !== '' && !Number.isNaN(minAge)) filter.age = { ...filter.age, $gte: minAge };
  if (params.maxAge !== undefined && params.maxAge !== '' && !Number.isNaN(maxAge)) filter.age = { ...filter.age, $lte: maxAge };
  if (typeof params.q === 'string' && params.q) {
    const re = new RegExp(escapeRe(params.q), 'i');
    filter.$or = [{ name: re }, { email: re }];
  }
  return filter;
};

/**
 * ?city=Kyiv&role=admin&minAge=20&maxAge=40&q=olena&sort=age&order=desc&limit=20&skip=0
 */
export const buildQuery = (query = {}) => {
  const sortField = SORT_FIELDS.includes(query.sort) ? query.sort : 'name';
  return {
    filter: buildFilter(query),
    sort: { [sortField]: query.order === 'desc' ? -1 : 1 },
    limit: Math.min(Math.max(Number(query.limit) || 50, 1), 100),
    skip: Math.max(Number(query.skip) || 0, 0),
  };
};

// ---------- READ ----------
export const findAll = ({ filter = {}, sort = { name: 1 }, limit = 50, skip = 0 } = {}) =>
  users().find(filter).sort(sort).skip(skip).limit(limit).toArray();

export const findById = (id) => users().findOne({ _id: toObjectId(id, 'userId') });

export const count = (filter = {}) => users().countDocuments(filter);

export const distinctCities = () => users().distinct('city');

// ---------- CREATE ----------
// insertOne
export const insertOne = async (data) => {
  const doc = { ...data, createdAt: new Date() };
  const { insertedId } = await users().insertOne(doc);
  return { _id: insertedId, ...doc };
};

// insertMany
export const insertMany = async (items) => {
  const now = new Date();
  const docs = items.map((item) => ({ ...item, createdAt: now }));
  const result = await users().insertMany(docs, { ordered: true });
  return { insertedCount: result.insertedCount, insertedIds: Object.values(result.insertedIds) };
};

// ---------- UPDATE ----------
// updateOne — часткове оновлення ($set)
export const updateOne = (id, data) =>
  users().updateOne({ _id: toObjectId(id, 'userId') }, { $set: { ...data, updatedAt: new Date() } });

// updateMany — оновлення всіх документів, що відповідають фільтру
export const updateMany = (filter, data) => users().updateMany(filter, { $set: { ...data, updatedAt: new Date() } });

// replaceOne — повна заміна документа (крім _id); createdAt зберігаємо
export const replaceOne = async (id, data) => {
  const _id = toObjectId(id, 'userId');
  const existing = await users().findOne({ _id }, { projection: { createdAt: 1 } });
  if (!existing) return { matchedCount: 0, modifiedCount: 0 };
  return users().replaceOne({ _id }, { ...data, createdAt: existing.createdAt ?? new Date(), updatedAt: new Date() });
};

// ---------- DELETE ----------
export const deleteOne = (id) => users().deleteOne({ _id: toObjectId(id, 'userId') });

export const deleteMany = (filter) => users().deleteMany(filter);
