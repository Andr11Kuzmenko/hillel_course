import { HttpError } from '../utils/HttpError.js';
import { isValidObjectId } from '../utils/objectId.js';

/**
 * Перевіряє, що параметр маршруту — валідний MongoDB ObjectId (24 hex-символи).
 */
export const validateObjectId = (name) => (req, res, next) => {
  if (!isValidObjectId(req.params[name])) {
    return next(new HttpError(400, `Param "${name}" must be a valid ObjectId`));
  }
  next();
};

/**
 * Валідує req.body одним документом; нормалізований результат — у req.validated.
 */
export const validateBody = (validator, options = {}) => (req, res, next) => {
  const { errors, value } = validator(req.body, options);
  if (errors.length) return next(new HttpError(400, 'Validation failed', errors));
  req.validated = value;
  next();
};

/**
 * Валідує масив документів для insertMany: body = [ {...}, {...} ] або { items: [...] }.
 */
export const validateBulk = (validator, { max = 100 } = {}) => (req, res, next) => {
  const items = Array.isArray(req.body) ? req.body : req.body?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new HttpError(400, 'Body must be a non-empty array of documents (or { "items": [...] })'));
  }
  if (items.length > max) {
    return next(new HttpError(400, `Too many documents: max ${max} per request`));
  }

  const details = [];
  const values = items.map((item, index) => {
    const { errors, value } = validator(item);
    if (errors.length) details.push({ index, errors });
    return value;
  });

  if (details.length) return next(new HttpError(400, 'Validation failed', details));
  req.validated = values;
  next();
};

/**
 * Валідує тіло updateMany: { filter: {...}, update: {...} }.
 * filter перевіряється whitelist-функцією, update — валідатором у режимі partial.
 */
export const validateUpdateMany = (validator, buildFilter) => (req, res, next) => {
  const { filter, update } = req.body ?? {};
  const errors = [];

  const mongoFilter = buildFilter(filter ?? {});
  if (!Object.keys(mongoFilter).length) {
    errors.push('filter must contain at least one supported field (use it to avoid updating every document)');
  }

  const { errors: updateErrors, value } = validator(update, { partial: true });
  errors.push(...updateErrors.map((e) => `update: ${e}`));

  if (errors.length) return next(new HttpError(400, 'Validation failed', errors));
  req.validated = { filter: mongoFilter, update: value };
  next();
};
