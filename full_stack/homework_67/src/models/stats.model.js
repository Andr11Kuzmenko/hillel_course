import { getCollection, COLLECTIONS } from '../db/mongo.js';

const users = () => getCollection(COLLECTIONS.users);
const articles = () => getCollection(COLLECTIONS.articles);

const round1 = (expr) => ({ $round: [expr, 1] });

/**
 * $match для користувачів із query-параметрів (?city=&role=&minAge=&maxAge=)
 */
const userMatch = ({ city, role, minAge, maxAge } = {}) => {
  const match = {};
  if (city) match.city = city;
  if (role) match.role = role;
  if (minAge || maxAge) {
    match.age = {};
    if (minAge) match.age.$gte = Number(minAge);
    if (maxAge) match.age.$lte = Number(maxAge);
  }
  return match;
};

/**
 * $match для статей (?category=&author=&from=&to=) — за замовчуванням лише опубліковані
 */
const articleMatch = ({ category, author, from, to, all } = {}) => {
  const match = all === 'true' ? {} : { published: { $ne: false } };
  if (category) match.category = category;
  if (author) match.author = author;
  if (from || to) {
    match.publishedAt = {};
    if (from && !Number.isNaN(Date.parse(from))) match.publishedAt.$gte = new Date(from);
    if (to && !Number.isNaN(Date.parse(to))) match.publishedAt.$lte = new Date(to);
  }
  return match;
};

// ---------- USERS ----------

// Кількість і вік користувачів за містами: $match -> $group -> $sort -> $project
export const usersByCity = (query) =>
  users()
    .aggregate([
      { $match: userMatch(query) },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          avgAge: { $avg: '$age' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' },
          names: { $push: '$name' },
        },
      },
      { $sort: { count: -1, _id: 1 } },
      { $project: { _id: 0, city: { $ifNull: ['$_id', 'Unknown'] }, count: 1, avgAge: round1('$avgAge'), minAge: 1, maxAge: 1, sampleNames: { $slice: ['$names', 5] } } },
    ])
    .toArray();

// Розподіл за ролями
export const usersByRole = (query) =>
  users()
    .aggregate([
      { $match: userMatch(query) },
      { $group: { _id: '$role', count: { $sum: 1 }, avgAge: { $avg: '$age' } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, role: { $ifNull: ['$_id', 'none'] }, count: 1, avgAge: round1('$avgAge') } },
    ])
    .toArray();

// Вікові групи: $bucket
export const usersAgeGroups = (query) =>
  users()
    .aggregate([
      { $match: { ...userMatch(query), age: { ...userMatch(query).age, $type: 'number' } } },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 25, 35, 45, 60, 151],
          default: 'other',
          output: { count: { $sum: 1 }, avgAge: { $avg: '$age' } },
        },
      },
      {
        $project: {
          _id: 0,
          range: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 0] }, then: '0-17' },
                { case: { $eq: ['$_id', 18] }, then: '18-24' },
                { case: { $eq: ['$_id', 25] }, then: '25-34' },
                { case: { $eq: ['$_id', 35] }, then: '35-44' },
                { case: { $eq: ['$_id', 45] }, then: '45-59' },
                { case: { $eq: ['$_id', 60] }, then: '60+' },
              ],
              default: 'other',
            },
          },
          count: 1,
          avgAge: round1('$avgAge'),
        },
      },
    ])
    .toArray();

// Найпопулярніші хобі: $unwind -> $group -> $sort -> $limit
export const topHobbies = (query, limit = 10) =>
  users()
    .aggregate([
      { $match: userMatch(query) },
      { $unwind: '$hobbies' },
      { $group: { _id: '$hobbies', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: limit },
      { $project: { _id: 0, hobby: '$_id', count: 1 } },
    ])
    .toArray();

// ---------- ARTICLES ----------

// Статистика за категоріями
export const articlesByCategory = (query) =>
  articles()
    .aggregate([
      { $match: articleMatch(query) },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          avgViews: { $avg: '$views' },
          totalLikes: { $sum: '$likes' },
          lastPublished: { $max: '$publishedAt' },
        },
      },
      { $sort: { totalViews: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          totalViews: 1,
          avgViews: { $round: ['$avgViews', 0] },
          totalLikes: 1,
          // частка лайків від переглядів, %
          likeRate: {
            $cond: [{ $gt: ['$totalViews', 0] }, { $round: [{ $multiply: [{ $divide: ['$totalLikes', '$totalViews'] }, 100] }, 2] }, 0],
          },
          lastPublished: 1,
        },
      },
    ])
    .toArray();

// Популярні теги
export const topTags = (query, limit = 10) =>
  articles()
    .aggregate([
      { $match: articleMatch(query) },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 }, views: { $sum: '$views' } } },
      { $sort: { count: -1, views: -1 } },
      { $limit: limit },
      { $project: { _id: 0, tag: '$_id', count: 1, views: 1 } },
    ])
    .toArray();

// Автори: $group + $lookup у колекцію users (місто автора)
export const articlesByAuthor = (query) =>
  articles()
    .aggregate([
      { $match: articleMatch(query) },
      {
        $group: {
          _id: '$author',
          articles: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          titles: { $push: '$title' },
        },
      },
      { $lookup: { from: COLLECTIONS.users, localField: '_id', foreignField: 'name', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $sort: { totalViews: -1 } },
      {
        $project: {
          _id: 0,
          author: '$_id',
          city: { $ifNull: ['$user.city', '—'] },
          articles: 1,
          totalViews: 1,
          totalLikes: 1,
          titles: 1,
        },
      },
    ])
    .toArray();

// Публікації по місяцях: $dateToString
export const articlesByMonth = (query) =>
  articles()
    .aggregate([
      { $match: { ...articleMatch(query), publishedAt: { ...articleMatch(query).publishedAt, $type: 'date' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$publishedAt' } },
          count: { $sum: 1 },
          views: { $sum: '$views' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', count: 1, views: 1 } },
    ])
    .toArray();

// Загальний огляд однією агрегацією: $facet
export const articlesOverview = async (query) => {
  const [result] = await articles()
    .aggregate([
      { $match: articleMatch(query) },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                articles: { $sum: 1 },
                views: { $sum: '$views' },
                likes: { $sum: '$likes' },
                avgViews: { $avg: '$views' },
              },
            },
            { $project: { _id: 0, articles: 1, views: 1, likes: 1, avgViews: { $round: ['$avgViews', 0] } } },
          ],
          mostViewed: [{ $sort: { views: -1 } }, { $limit: 3 }, { $project: { title: 1, views: 1, author: 1 } }],
          mostLiked: [{ $sort: { likes: -1 } }, { $limit: 3 }, { $project: { title: 1, likes: 1, author: 1 } }],
        },
      },
    ])
    .toArray();

  return {
    totals: result.totals[0] ?? { articles: 0, views: 0, likes: 0, avgViews: 0 },
    mostViewed: result.mostViewed,
    mostLiked: result.mostLiked,
  };
};
