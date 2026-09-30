# Homework 65 — Інтеграція MongoDB Atlas з існуючим сервером Express

## Завдання
Підключити Express-сервер до MongoDB Atlas, реалізувати операції читання (READ) та відобразити дані на сторінках сервера.

## Що змінилося порівняно з homework_64
- Додано офіційний драйвер **`mongodb`**. Налаштування — з `.env`: `MONGODB_URI` (рядок підключення Atlas) та `MONGODB_DB` (назва бази, за замовчуванням `hillel_hw`).
- `src/db/mongo.js` — `connectToDatabase()` / `getDb()` / `getCollection()` / `closeDatabase()`; `serverSelectionTimeoutMS: 5000`, перевірка `ping` під час старту.
- `src/server.js` — сервер стартує **лише після** успішного підключення до БД. Якщо `MONGODB_URI` не задано або кластер недоступний, у консоль виводиться зрозуміле повідомлення і процес завершується з кодом 1. Коректне завершення (SIGINT/SIGTERM) закриває з'єднання.
- Моделі `users` та `articles` тепер читають дані з MongoDB (замість масивів у пам'яті):
  - `find()` з фільтрами, сортуванням, `skip`/`limit` і проєкцією; `findOne()` за `_id`; `countDocuments()`; `distinct()`;
  - фільтри з query-параметрів (`?city=Kyiv&minAge=20&sort=age&order=desc`, `?category=Databases&tag=mongodb&q=cursor`).
- Облікові записи Passport перенесено в колекцію `accounts` (реєстрація = `insertOne`, пароль — bcrypt-хеш, унікальний індекс на `email`).
- id тепер — MongoDB `ObjectId`: мідлвара `validateObjectId` (400 для невалідного id), `src/utils/objectId.js`.
- Новий JSON API `/api/*` (READ) та `/api/health` (перевірка з'єднання).
- Сторінки PUG (`/users`) та EJS (`/articles`) показують дані з БД, мають форми фільтрації/сортування.
- Обробник помилок: дублікат унікального ключа → 409, недоступна БД → 503.
- `scripts/seed.js` (`npm run seed`) — очищує та заповнює колекції `users` (12 документів) і `articles` (15 документів) через `insertMany`, створює індекси.
- Маршрути `POST/PUT/DELETE /users` і `/articles` (in-memory з hw 62–64) тимчасово прибрано — у цьому завданні лише READ; запис у MongoDB реалізовано в homework_66 (мідлвара `auth.js` залишена для нього).

## Маршрути
| Метод | Шлях | Опис |
|---|---|---|
| GET | `/users` | список користувачів з MongoDB (PUG), фільтри `q, city, role, minAge, maxAge, sort, order, limit, skip` |
| GET | `/users/:userId` | користувач за `_id` (PUG) |
| GET | `/articles` | список статей з MongoDB (EJS), фільтри `q, category, tag, author, sort, order, limit, skip` |
| GET | `/articles/:articleId` | стаття за `_id` (EJS) |
| GET | `/api/health` | ping до БД |
| GET | `/api/users`, `/api/users/:userId` | JSON |
| GET | `/api/articles`, `/api/articles/:articleId` | JSON |
| GET, POST | `/auth/register`, `/auth/login` | Passport (акаунти в MongoDB) |
| GET, POST | `/auth/logout` | вихід |
| GET | `/profile`, `/protected` | захищені сторінки |
| GET, POST, DELETE | `/preferences...` | тема в cookies |
| GET, DELETE | `/session` | сесія |

Сторінки `/users` та `/articles` також віддають JSON, якщо надіслати `Accept: application/json`.

## Запуск
1. У MongoDB Atlas створити кластер, користувача БД та додати свій IP в **Network Access**.
2. Налаштувати змінні оточення:
   ```bash
   cp .env.example .env
   # вписати MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/...
   ```
3. Встановити залежності, заповнити базу і запустити:
   ```bash
   npm install
   npm run seed
   npm start          # або npm run dev
   ```
4. Відкрити http://localhost:3000/users та http://localhost:3000/articles

Якщо БД недоступна:
```
[startup] Failed to connect to MongoDB.
[startup] Cannot connect to MongoDB (...)
[startup] Check MONGODB_URI in .env, your network and the IP Access List in MongoDB Atlas.
```
