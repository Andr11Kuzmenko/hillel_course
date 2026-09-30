import { ObjectId } from 'mongodb';
import { HttpError } from './HttpError.js';

export const isValidObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

/**
 * Перетворює рядок на ObjectId або кидає HttpError 400.
 */
export const toObjectId = (value, name = 'id') => {
  if (!isValidObjectId(value)) {
    throw new HttpError(400, `Invalid ${name}: "${value}" is not a valid ObjectId`);
  }
  return new ObjectId(value);
};
