/**
 * Заповнює базу тестовими даними: npm run seed
 * Очищує колекції users та articles, вставляє документи (insertMany) і створює індекси.
 *
 * Додаткові згенеровані користувачі (для демонстрації курсорів/batchSize):
 *   npm run seed -- --extra=1000
 */
import 'dotenv/config';
import { connectToDatabase, closeDatabase, COLLECTIONS } from '../src/db/mongo.js';
import { MONGODB_DB } from '../src/config.js';
import { users } from './data/users.js';
import { articles } from './data/articles.js';
import { generateUsers } from './data/generate.js';

const extraArg = process.argv.find((a) => a.startsWith('--extra='));
const EXTRA = Math.min(Math.max(Number(extraArg?.split('=')[1]) || 0, 0), 100000);

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
  if (EXTRA) {
    // великі обсяги вставляємо пачками по 1000
    const generated = generateUsers(EXTRA);
    for (let i = 0; i < generated.length; i += 1000) {
      await usersCol.insertMany(generated.slice(i, i + 1000), { ordered: false });
    }
    console.log(`Inserted ${EXTRA} generated users`);
  }

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
