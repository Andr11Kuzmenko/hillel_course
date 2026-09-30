# Homework 60 — Розробка RESTful API з використанням Express

## Завдання
Створити сервер на Node.js + Express з модульною структурою (окремі модулі для маршрутів і контролерів) та реалізувати маршрути для `users` і `articles`. Відповіді — звичайний текст.

## Що зроблено
- Express 5, ES-модулі.
- Структура:
  - `src/server.js` — запуск сервера;
  - `src/app.js` — створення застосунку, підключення роутерів;
  - `src/routes/` — роутери (`root`, `users`, `articles`);
  - `src/controllers/` — контролери з обробниками;
  - `src/middlewares/` — обробник 404 та централізований обробник помилок.

## Маршрути
| Метод | Шлях | Відповідь |
|---|---|---|
| GET | `/` | `Get root route` |
| GET | `/users` | `Get users route` |
| POST | `/users` | `Post users route` |
| GET | `/users/:userId` | `Get user by Id route: {userId}` |
| PUT | `/users/:userId` | `Put user by Id route: {userId}` |
| DELETE | `/users/:userId` | `Delete user by Id route: {userId}` |
| GET | `/articles` | `Get articles route` |
| POST | `/articles` | `Post articles route` |
| GET | `/articles/:articleId` | `Get article by Id route: {articleId}` |
| PUT | `/articles/:articleId` | `Put article by Id route: {articleId}` |
| DELETE | `/articles/:articleId` | `Delete article by Id route: {articleId}` |

Будь-який інший шлях → `404 Not Found`.

## Запуск
```bash
npm install
npm start      # або npm run dev (node --watch)
```
Сервер слухає `http://localhost:3000` (порт можна змінити змінною `PORT`).

Приклад:
```bash
curl http://localhost:3000/users/5
curl -X DELETE http://localhost:3000/articles/7
```
