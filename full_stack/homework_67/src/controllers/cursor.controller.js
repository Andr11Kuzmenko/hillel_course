import { getCollection, COLLECTIONS } from '../db/mongo.js';
import { paginateWithCursor, streamCursorToResponse } from '../db/cursor.js';
import * as User from '../models/users.model.js';
import * as Article from '../models/articles.model.js';
import { HttpError } from '../utils/HttpError.js';

// Колекції, які дозволено читати курсором, та їхні фільтри/сортування
const SOURCES = {
  users: { collection: COLLECTIONS.users, buildFilter: User.buildFilter, sort: { name: 1, _id: 1 } },
  articles: {
    collection: COLLECTIONS.articles,
    buildFilter: Article.buildFilter,
    sort: { publishedAt: -1, _id: 1 },
    projection: { content: 0 },
  },
};

const getSource = (name) => {
  const source = SOURCES[name];
  if (!source) throw new HttpError(404, `Unknown collection "${name}". Available: ${Object.keys(SOURCES).join(', ')}`);
  return source;
};

const clampInt = (value, def, min, max) => Math.min(Math.max(Number.parseInt(value, 10) || def, min), max);

/**
 * GET /api/cursor/:collection/stream?format=ndjson|json&batchSize=10&limit=0&city=Kyiv...
 * Стрімінг документів курсором (for await ... of cursor) з заданим batchSize.
 */
export const streamCollection = async (req, res) => {
  const source = getSource(req.params.collection);
  const format = req.query.format === 'json' ? 'json' : 'ndjson';
  const batchSize = clampInt(req.query.batchSize, 10, 1, 1000);
  const limit = clampInt(req.query.limit, 0, 0, 100000); // 0 — без обмеження

  const cursor = getCollection(source.collection)
    .find(source.buildFilter(req.query), { projection: source.projection })
    .sort(source.sort)
    .limit(limit)
    .batchSize(batchSize);

  res.status(200);
  res.set('Content-Type', format === 'json' ? 'application/json; charset=utf-8' : 'application/x-ndjson; charset=utf-8');
  res.set('X-Cursor-Batch-Size', String(batchSize));

  const started = Date.now();
  const { count, aborted } = await streamCursorToResponse(cursor, res, { format });
  console.log(
    `[cursor] streamed ${count} ${req.params.collection} (batchSize=${batchSize}, format=${format}) in ${Date.now() - started} ms${aborted ? ' — client disconnected' : ''}`,
  );
};

/**
 * GET /api/cursor/:collection?page=1&pageSize=10&...
 * Пагінація курсором (skip/limit + hasNext/next).
 */
export const paginateCollection = async (req, res) => {
  const source = getSource(req.params.collection);
  const result = await paginateWithCursor(getCollection(source.collection), {
    filter: source.buildFilter(req.query),
    sort: source.sort,
    projection: source.projection,
    page: clampInt(req.query.page, 1, 1, 1e6),
    pageSize: clampInt(req.query.pageSize, 10, 1, 100),
  });
  res.json(result);
};

/**
 * GET /api/cursor/users/summary — обхід усіх користувачів курсором з підрахунком
 * статистики "на льоту" (у пам'яті тримається лише поточний батч).
 */
export const summarizeUsers = async (req, res) => {
  const batchSize = clampInt(req.query.batchSize, 50, 1, 1000);
  const cursor = getCollection(COLLECTIONS.users)
    .find(User.buildFilter(req.query), { projection: { age: 1, city: 1 } })
    .batchSize(batchSize);

  let count = 0;
  let ageSum = 0;
  let withAge = 0;
  const cities = new Set();

  try {
    for await (const doc of cursor) {
      count += 1;
      if (typeof doc.age === 'number') {
        ageSum += doc.age;
        withAge += 1;
      }
      if (doc.city) cities.add(doc.city);
    }
  } finally {
    await cursor.close();
  }

  res.json({
    method: 'for await (const doc of cursor)',
    batchSize,
    count,
    avgAge: withAge ? Math.round((ageSum / withAge) * 10) / 10 : null,
    distinctCities: cities.size,
  });
};

/**
 * GET /cursor/users?page=1&pageSize=10 — сторінка (PUG) з пагінацією через курсор.
 */
export const usersPage = async (req, res) => {
  const pageSize = clampInt(req.query.pageSize, 5, 1, 50);
  const result = await paginateWithCursor(getCollection(COLLECTIONS.users), {
    filter: User.buildFilter(req.query),
    sort: SOURCES.users.sort,
    page: clampInt(req.query.page, 1, 1, 1e6),
    pageSize,
  });
  res.render('cursor/users', { title: 'Users (cursor pagination)', ...result, city: req.query.city || '' });
};
