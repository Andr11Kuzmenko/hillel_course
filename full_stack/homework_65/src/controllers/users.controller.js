import * as User from '../models/users.model.js';
import { HttpError } from '../utils/HttpError.js';

const wantsJson = (req) => req.accepts(['html', 'json']) === 'json';

// GET /users — список користувачів з MongoDB (PUG)
// Express 5 сам передає помилки async-обробників у errorHandler
export const getUsers = async (req, res) => {
  const query = User.buildQuery(req.query);
  const [users, total, cities] = await Promise.all([User.findAll(query), User.count(query.filter), User.distinctCities()]);

  if (wantsJson(req)) return res.json({ total, count: users.length, items: users });
  res.render('users/list', { title: 'Users', users, total, cities: cities.sort(), query: req.query });
};

// GET /users/:userId — деталі (PUG)
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new HttpError(404, `User ${req.params.userId} not found`);

  if (wantsJson(req)) return res.json(user);
  res.render('users/detail', { title: user.name, user });
};
