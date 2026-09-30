import bcrypt from 'bcryptjs';
import { getCollection, COLLECTIONS } from '../db/mongo.js';
import { isValidObjectId, toObjectId } from '../utils/objectId.js';

// Облікові записи для Passport зберігаються в MongoDB (колекція accounts)
const accounts = () => getCollection(COLLECTIONS.accounts);

export const findByEmail = (email) => accounts().findOne({ email: String(email).toLowerCase().trim() });

export const findById = (id) => (isValidObjectId(String(id)) ? accounts().findOne({ _id: toObjectId(String(id)) }) : null);

export const create = async ({ name, email, password }) => {
  const doc = {
    name: name?.trim() || email.split('@')[0],
    email: email.toLowerCase().trim(),
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date(),
  };
  const { insertedId } = await accounts().insertOne(doc);
  return { _id: insertedId, ...doc };
};

export const verifyPassword = (account, password) => bcrypt.compare(password, account.passwordHash);

// Публічне представлення без хешу пароля
export const toPublic = ({ _id, passwordHash, ...rest }) => ({ id: String(_id), ...rest }); // eslint-disable-line no-unused-vars
