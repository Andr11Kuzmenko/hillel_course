/**
 * Заповнює базу тестовими даними: npm run seed
 * Очищує колекції users та articles, вставляє документи (insertMany) і створює індекси.
 */
import 'dotenv/config';
import { connectToDatabase, closeDatabase, COLLECTIONS } from '../src/db/mongo.js';
import { MONGODB_DB } from '../src/config.js';
import { users } from './data/users.js';
import { articles } from './data/articles.js';

const run = async () => {
  const db = await connectToDatabase();
  console.log(`Connected to "${MONGODB_DB}"`);

  const usersCol = db.collection(COLLECTIONS.users);
  const articlesCol = db.collection(COLLECTIONS.articles);
  const accountsCol = db.collection(COLLECTIONS.accounts);

  await usersCol.deleteMany({});
  await articlesCol.deleteMany({});

  const u = await usersCol.insertMany(users);
  const a = await articlesCol.insertMany(articles);
  console.log(`Inserted ${u.insertedCount} users, ${a.insertedCount} articles`);

  await usersCol.createIndex({ email: 1 }, { unique: true });
  await usersCol.createIndex({ city: 1, age: 1 });
  await articlesCol.createIndex({ category: 1, publishedAt: -1 });
  await articlesCol.createIndex({ tags: 1 });
  await accountsCol.createIndex({ email: 1 }, { unique: true });
  console.log('Indexes created');
};

run()
  .catch((err) => {
    console.error(`Seed failed: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(closeDatabase);
