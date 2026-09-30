import * as User from '../models/users.model.js';
import { HttpError } from '../utils/HttpError.js';

const wantsJson = (req) => req.accepts(['html', 'json']) === 'json';
const notFound = (id) => new HttpError(404, `User ${id} not found`);

// ---------- READ (PUG) ----------
// Express 5 сам передає помилки async-обробників у errorHandler
export const getUsers = async (req, res) => {
  const query = User.buildQuery(req.query);
  const [users, total, cities] = await Promise.all([User.findAll(query), User.count(query.filter), User.distinctCities()]);

  if (wantsJson(req)) return res.json({ total, count: users.length, items: users });
  res.render('users/list', { title: 'Users', users, total, cities: cities.sort(), query: req.query });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw notFound(req.params.userId);

  if (wantsJson(req)) return res.json(user);
  res.render('users/detail', { title: user.name, user });
};

// ---------- CREATE ----------
// POST /users — insertOne
export const createUser = async (req, res) => {
  const user = await User.insertOne(req.validated);
  res.status(201).location(`/users/${user._id}`).json({ operation: 'insertOne', insertedId: user._id, item: user });
};

// POST /users/bulk — insertMany
export const createUsers = async (req, res) => {
  const result = await User.insertMany(req.validated);
  res.status(201).json({ operation: 'insertMany', ...result });
};

// ---------- UPDATE ----------
// PATCH /users/:userId — updateOne
export const updateUser = async (req, res) => {
  const { matchedCount, modifiedCount } = await User.updateOne(req.params.userId, req.validated);
  if (!matchedCount) throw notFound(req.params.userId);
  const item = await User.findById(req.params.userId);
  res.json({ operation: 'updateOne', matchedCount, modifiedCount, item });
};

// PATCH /users — updateMany  { filter: {...}, update: {...} }
export const updateUsers = async (req, res) => {
  const { filter, update } = req.validated;
  const { matchedCount, modifiedCount } = await User.updateMany(filter, update);
  res.json({ operation: 'updateMany', filter, matchedCount, modifiedCount });
};

// PUT /users/:userId — replaceOne
export const replaceUser = async (req, res) => {
  const { matchedCount, modifiedCount } = await User.replaceOne(req.params.userId, req.validated);
  if (!matchedCount) throw notFound(req.params.userId);
  const item = await User.findById(req.params.userId);
  res.json({ operation: 'replaceOne', matchedCount, modifiedCount, item });
};

// ---------- DELETE ----------
// DELETE /users/:userId — deleteOne
export const deleteUser = async (req, res) => {
  const { deletedCount } = await User.deleteOne(req.params.userId);
  if (!deletedCount) throw notFound(req.params.userId);
  res.json({ operation: 'deleteOne', deletedCount });
};

// DELETE /users?city=...&role=...&minAge=...&maxAge=... — deleteMany (фільтр обов'язковий)
export const deleteUsers = async (req, res) => {
  const filter = User.buildFilter(req.query);
  if (!Object.keys(filter).length) {
    throw new HttpError(400, 'deleteMany requires at least one filter: city, role, minAge, maxAge or q');
  }
  const { deletedCount } = await User.deleteMany(filter);
  res.json({ operation: 'deleteMany', filter: req.query, deletedCount });
};
