import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGODB_URI, MONGODB_DB } from '../config.js';

let client = null;
let db = null;

/**
 * Підключення до MongoDB (Atlas або локальний сервер) через офіційний драйвер.
 * Кидає зрозумілу помилку, якщо URI не задано або сервер недоступний.
 */
export const connectToDatabase = async () => {
  if (db) return db;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and put your MongoDB Atlas connection string there.');
  }

  client = new MongoClient(MONGODB_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: false, deprecationErrors: true },
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    db = client.db(MONGODB_DB);
    await db.command({ ping: 1 });
  } catch (err) {
    await client.close().catch(() => {});
    client = null;
    db = null;
    throw new Error(`Cannot connect to MongoDB (${err.message})`, { cause: err });
  }

  return db;
};

export const getDb = () => {
  if (!db) throw new Error('Database is not connected. Call connectToDatabase() first.');
  return db;
};

export const getCollection = (name) => getDb().collection(name);

export const closeDatabase = async () => {
  if (client) await client.close();
  client = null;
  db = null;
};

// Назви колекцій в одному місці
export const COLLECTIONS = {
  users: 'users',
  articles: 'articles',
  accounts: 'accounts',
};
