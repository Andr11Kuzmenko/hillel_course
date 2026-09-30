import * as Stats from '../models/stats.model.js';
import { HttpError } from '../utils/HttpError.js';

// Доступні агрегації для JSON API: GET /api/stats/:name
const REPORTS = {
  'users-by-city': Stats.usersByCity,
  'users-by-role': Stats.usersByRole,
  'users-age-groups': Stats.usersAgeGroups,
  'top-hobbies': Stats.topHobbies,
  'articles-by-category': Stats.articlesByCategory,
  'articles-by-author': Stats.articlesByAuthor,
  'articles-by-month': Stats.articlesByMonth,
  'top-tags': Stats.topTags,
  'articles-overview': Stats.articlesOverview,
};

// GET /api/stats — список доступних звітів
export const listReports = (req, res) => {
  res.json({ reports: Object.keys(REPORTS).map((name) => `/api/stats/${name}`) });
};

// GET /api/stats/:name?city=...&category=...
export const getReport = async (req, res) => {
  const report = REPORTS[req.params.name];
  if (!report) throw new HttpError(404, `Unknown report "${req.params.name}"`);
  const started = Date.now();
  const data = await report(req.query);
  res.json({ report: req.params.name, filters: req.query, tookMs: Date.now() - started, data });
};

// GET /stats — сторінка зі статистикою (PUG)
export const statsPage = async (req, res) => {
  const [byCity, byRole, ageGroups, hobbies, byCategory, byAuthor, byMonth, tags, overview] = await Promise.all([
    Stats.usersByCity(req.query),
    Stats.usersByRole(req.query),
    Stats.usersAgeGroups(req.query),
    Stats.topHobbies(req.query, 5),
    Stats.articlesByCategory(req.query),
    Stats.articlesByAuthor(req.query),
    Stats.articlesByMonth(req.query),
    Stats.topTags(req.query, 10),
    Stats.articlesOverview(req.query),
  ]);

  res.render('stats', {
    title: 'Statistics',
    query: req.query,
    byCity,
    byRole,
    ageGroups,
    hobbies,
    byCategory,
    byAuthor,
    byMonth,
    tags,
    overview,
  });
};
