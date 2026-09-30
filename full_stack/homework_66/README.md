# Homework 66 — Розширення функціональності сервера Express з MongoDB Atlas

## Завдання
Додати до сервера операції створення, оновлення та видалення документів у MongoDB Atlas:
- **insertOne**, **insertMany**;
- **updateOne**, **updateMany**, **replaceOne**;
- **deleteOne**, **deleteMany**.

## Що змінилося порівняно з homework_65
- `src/models/users.model.js`, `src/models/articles.model.js` — додано методи `insertOne`, `insertMany`, `updateOne` (`$set`), `updateMany`, `replaceOne`, `deleteOne`, `deleteMany`, а також `incrementLikes` (`updateOne` з `$inc`). Автоматично проставляються `createdAt` / `updatedAt`; `replaceOne` зберігає оригінальний `createdAt`.
- `src/models/*.buildFilter()` — фільтр будується лише з дозволених полів (whitelist), тому клієнт не може передати довільні MongoDB-оператори. Використовується для `find`, `updateMany`, `deleteMany`.
- `src/validators/` — валідація та нормалізація документів (`validateUser`, `validateArticle`): режим повного документа (insert/replace) і часткового оновлення (update); невідомі поля відхиляються.
- `src/middlewares/validation.js` — `validateObjectId`, `validateBody`, `validateBulk` (масив до 100 документів з помилками по індексах), `validateUpdateMany` (`{ filter, update }`).
- Захист від масових операцій без фільтра: `updateMany` / `deleteMany` з порожнім фільтром → 400.
- Помилки: невалідний `ObjectId` → 400, документ не знайдено → 404, дублікат `email` (унікальний індекс) → 409, невалідний JSON → 400, БД недоступна → 503.
- Права доступу: `/users` — запис вимагає Passport-сесії або `Authorization: Bearer <API_TOKEN>`; `/articles` — заголовок `X-User-Role` (`POST/PUT/PATCH` — editor/admin, `DELETE` — admin). Лайк статті доступний усім (кнопка на сторінці статті).

## Маршрути

### Users (`Authorization: Bearer secret-token` або вхід через `/auth/login`)
| Метод | Шлях | Операція MongoDB | Тіло / параметри |
|---|---|---|---|
| GET | `/users`, `/users/:userId` | find / findOne | сторінки PUG (JSON з `Accept: application/json`) |
| POST | `/users` | **insertOne** | `{ name, email, age?, city?, role?, hobbies? }` → 201 |
| POST | `/users/bulk` | **insertMany** | `[ {...}, {...} ]` або `{ "items": [...] }` → 201 |
| PATCH | `/users/:userId` | **updateOne** (`$set`) | будь-які поля користувача |
| PATCH | `/users` | **updateMany** | `{ "filter": { city?, role?, minAge?, maxAge?, q? }, "update": {...} }` |
| PUT | `/users/:userId` | **replaceOne** | повний документ (`name`, `email` обов'язкові) |
| DELETE | `/users/:userId` | **deleteOne** | — |
| DELETE | `/users?city=...&role=...&minAge=...&maxAge=...` | **deleteMany** | хоча б один фільтр обов'язковий |

### Articles (`X-User-Role: editor` / `admin`)
| Метод | Шлях | Операція MongoDB | Тіло / параметри |
|---|---|---|---|
| GET | `/articles`, `/articles/:articleId` | find / findOne | сторінки EJS |
| POST | `/articles` | **insertOne** | `{ title, content, author?, category?, tags?, views?, likes?, published?, publishedAt? }` |
| POST | `/articles/bulk` | **insertMany** | масив статей |
| PATCH | `/articles/:articleId` | **updateOne** (`$set`) | часткові поля |
| POST | `/articles/:articleId/like` | **updateOne** (`$inc`) | — (доступно всім) |
| PATCH | `/articles` | **updateMany** | `{ "filter": { category?, tag?, author?, published?, q? }, "update": {...} }` |
| PUT | `/articles/:articleId` | **replaceOne** | повний документ (`title`, `content` обов'язкові) |
| DELETE | `/articles/:articleId` | **deleteOne** | лише `admin` |
| DELETE | `/articles?category=...&tag=...` | **deleteMany** | лише `admin`, фільтр обов'язковий |

Інше без змін: `/api/*` (READ JSON), `/api/health`, `/auth/*`, `/profile`, `/protected`, `/preferences/*`, `/session`.

## Запуск
```bash
cp .env.example .env    # вписати MONGODB_URI від MongoDB Atlas
npm install
npm run seed            # тестові дані
npm start               # або npm run dev
```

## Приклади
```bash
# insertOne
curl -X POST http://localhost:3000/users -H "Authorization: Bearer secret-token" \
  -H "Content-Type: application/json" -d '{"name":"Ann","email":"ann@example.com","age":30,"city":"Poltava"}'
# insertMany
curl -X POST http://localhost:3000/users/bulk -H "Authorization: Bearer secret-token" \
  -H "Content-Type: application/json" -d '[{"name":"Bob","email":"bob@example.com"},{"name":"Eve","email":"eve@example.com"}]'
# updateMany
curl -X PATCH http://localhost:3000/users -H "Authorization: Bearer secret-token" \
  -H "Content-Type: application/json" -d '{"filter":{"city":"Poltava"},"update":{"role":"editor"}}'
# replaceOne
curl -X PUT http://localhost:3000/articles/<id> -H "X-User-Role: editor" \
  -H "Content-Type: application/json" -d '{"title":"Replaced","content":"New content"}'
# deleteMany
curl -X DELETE "http://localhost:3000/articles?category=Test" -H "X-User-Role: admin"
```
