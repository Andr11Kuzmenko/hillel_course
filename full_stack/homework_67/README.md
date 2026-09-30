# Homework 67 — Використання курсорів та агрегаційних запитів у MongoDB

## Завдання
1. Реалізувати маршрути, які використовують **курсори** для ітерації документів, не завантажуючи всю вибірку в пам'ять.
2. Реалізувати маршрут з **агрегаційним запитом** для збору статистики та показати результати.

## Що змінилося порівняно з homework_66
- `src/db/cursor.js`:
  - `streamCursorToResponse()` — `for await (const doc of cursor)` з `batchSize`, запис у відповідь частинами (NDJSON або JSON-масив), обробка backpressure (`drain`) та закриття курсора, якщо клієнт відключився;
  - `paginateWithCursor()` — `find().sort().skip().limit()` + ручна ітерація `cursor.hasNext()` / `cursor.next()`.
- `src/controllers/cursor.controller.js` + `src/routes/cursor.routes.js` — стрімінг, пагінація та підрахунок статистики «на льоту» курсором (у пам'яті лише поточний батч).
- `src/models/stats.model.js` — агрегаційні пайплайни: `$match`, `$group` (`$sum`, `$avg`, `$min`, `$max`, `$push`), `$sort`, `$project` (`$round`, `$cond`, `$ifNull`, `$slice`), `$bucket`, `$unwind`, `$lookup`, `$dateToString`, `$facet`, `$limit`.
- `src/controllers/stats.controller.js` — JSON API `/api/stats/:name` та сторінка `/stats` (PUG) з таблицями й фільтрами.
- Нова сторінка `/cursor/users` (PUG) — пагінація курсором з кнопками Prev/Next.
- `npm run seed -- --extra=1000` — додатково генерує N користувачів (пачками `insertMany` по 1000), щоб наочно побачити роботу курсорів і `batchSize`.
- Обробник помилок не намагається змінити статус, якщо стрім уже почався (`res.headersSent`).
- Меню: посилання Stats і Cursor.

## Нові маршрути

### Курсори
| Метод | Шлях | Опис |
|---|---|---|
| GET | `/api/cursor/:collection/stream` | стрімінг усіх документів (`users` або `articles`) курсором. Параметри: `format=ndjson` (за замовчуванням) або `json`, `batchSize` (1–1000, за замовч. 10), `limit`, фільтри (`city`, `role`, `minAge`, `maxAge`, `q` / `category`, `tag`, `author`) |
| GET | `/api/cursor/:collection?page=1&pageSize=10` | пагінація курсором (`skip`/`limit` + `hasNext`/`next`), відповідь з `total`, `totalPages`, `hasPrevPage`, `hasNextPage` |
| GET | `/api/cursor/users/summary?batchSize=50` | обхід усіх користувачів курсором із підрахунком кількості, середнього віку та кількості міст |
| GET | `/cursor/users?page=1&pageSize=5&city=Kyiv` | сторінка PUG з пагінацією курсором |

### Агрегації
| Метод | Шлях | Стадії |
|---|---|---|
| GET | `/stats` | сторінка PUG з усіма звітами (фільтри `city`, `minAge`, `category`) |
| GET | `/api/stats` | список звітів |
| GET | `/api/stats/users-by-city` | `$match` → `$group` (count, avg/min/max age) → `$sort` → `$project` |
| GET | `/api/stats/users-by-role` | `$match` → `$group` → `$sort` → `$project` |
| GET | `/api/stats/users-age-groups` | `$match` → `$bucket` → `$project` (`$switch`) |
| GET | `/api/stats/top-hobbies` | `$unwind` → `$group` → `$sort` → `$limit` |
| GET | `/api/stats/articles-by-category` | `$match` → `$group` (views, likes) → `$sort` → `$project` (like rate, %) |
| GET | `/api/stats/articles-by-author` | `$group` → `$lookup` (users) → `$unwind` → `$sort` → `$project` |
| GET | `/api/stats/articles-by-month` | `$group` за `$dateToString` → `$sort` |
| GET | `/api/stats/top-tags` | `$unwind` → `$group` → `$sort` → `$limit` |
| GET | `/api/stats/articles-overview` | `$facet` (totals, mostViewed, mostLiked) |

Параметри фільтрації для звітів: `city`, `role`, `minAge`, `maxAge` (користувачі); `category`, `author`, `from`, `to`, `all=true` (статті, за замовчуванням лише опубліковані).

Усі маршрути попередніх завдань збережено: CRUD `/users`, `/articles` (hw 66), `/api/*` (hw 65), Passport `/auth/*`, `/profile`, `/protected` (hw 64), тема в cookies, favicon (hw 63), PUG/EJS (hw 62), мідлвари (hw 61).

## Запуск
```bash
cp .env.example .env         # вписати MONGODB_URI від MongoDB Atlas
npm install
npm run seed -- --extra=1000 # тестові дані + 1000 згенерованих користувачів
npm start                    # або npm run dev
```

## Приклади
```bash
# NDJSON-стрім, по 100 документів у батчі
curl "http://localhost:3000/api/cursor/users/stream?batchSize=100"
# JSON-масив статей категорії Databases
curl "http://localhost:3000/api/cursor/articles/stream?format=json&category=Databases"
# 3-тя сторінка користувачів з Києва
curl "http://localhost:3000/api/cursor/users?page=3&pageSize=5&city=Kyiv"
# агрегація
curl "http://localhost:3000/api/stats/articles-by-category"
curl "http://localhost:3000/api/stats/users-by-city?minAge=30"
```
Сторінки: http://localhost:3000/stats, http://localhost:3000/cursor/users
