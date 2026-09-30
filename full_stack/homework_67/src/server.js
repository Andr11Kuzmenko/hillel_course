import 'dotenv/config';
import app from './app.js';
import { PORT, MONGODB_DB } from './config.js';
import { connectToDatabase, closeDatabase } from './db/mongo.js';

const start = async () => {
  try {
    await connectToDatabase();
    console.log(`Connected to MongoDB, database "${MONGODB_DB}"`);
  } catch (err) {
    console.error('\n[startup] Failed to connect to MongoDB.');
    console.error(`[startup] ${err.message}`);
    console.error('[startup] Check MONGODB_URI in .env, your network and the IP Access List in MongoDB Atlas.\n');
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received, shutting down...`);
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start();
