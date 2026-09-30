import * as User from '../models/users.model.js';
import { HttpError } from '../utils/HttpError.js';

const wantsJson = (req) => req.accepts(['html', 'json']) === 'json';

// GET /users — список (PUG)
export const getUsers = (req, res) => {
  const users = User.findAll();
  if (wantsJson(req)) return res.json(users);
  res.render('users/list', { title: 'Users', users });
};

// GET /users/:userId — деталі (PUG)
export const getUserById = (req, res, next) => {
  const user = User.findById(req.params.userId);
  if (!user) return next(new HttpError(404, `User ${req.params.userId} not found`));
  if (wantsJson(req)) return res.json(user);
  res.render('users/detail', { title: user.name, user });
};

export const postUsers = (req, res) => {
  const user = User.create(req.body);
  res.status(201).json(user);
};

export const putUserById = (req, res, next) => {
  const user = User.update(req.params.userId, req.body);
  if (!user) return next(new HttpError(404, `User ${req.params.userId} not found`));
  res.json(user);
};

export const deleteUserById = (req, res, next) => {
  const user = User.remove(req.params.userId);
  if (!user) return next(new HttpError(404, `User ${req.params.userId} not found`));
  res.json({ message: `User ${user.id} deleted`, user });
};
