import { HttpError } from '../utils/HttpError.js';
import { isValidObjectId } from '../utils/objectId.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Перевіряє, що параметр маршруту — валідний MongoDB ObjectId (24 hex-символи).
 */
export const validateObjectId = (name) => (req, res, next) => {
  if (!isValidObjectId(req.params[name])) {
    return next(new HttpError(400, `Param "${name}" must be a valid ObjectId`));
  }
  next();
};

const isNonEmptyString = (v, min = 1) => typeof v === 'string' && v.trim().length >= min;

export const validateUserBody = (req, res, next) => {
  const { name, email, age } = req.body ?? {};
  const errors = [];

  if (!isNonEmptyString(name, 2)) errors.push('name is required (min 2 chars)');
  if (!isNonEmptyString(email) || !EMAIL_RE.test(email)) errors.push('email must be a valid email');
  if (age !== undefined && (!Number.isInteger(Number(age)) || Number(age) < 0)) {
    errors.push('age must be a non-negative integer');
  }

  if (errors.length) return next(new HttpError(400, 'Validation failed', errors));
  next();
};

export const validateArticleBody = (req, res, next) => {
  const { title, content } = req.body ?? {};
  const errors = [];

  if (!isNonEmptyString(title, 3)) errors.push('title is required (min 3 chars)');
  if (!isNonEmptyString(content)) errors.push('content is required');

  if (errors.length) return next(new HttpError(400, 'Validation failed', errors));
  next();
};
