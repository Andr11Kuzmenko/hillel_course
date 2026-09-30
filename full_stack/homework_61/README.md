# Homework 61 — Розширення Express сервера за допомогою мідлварів

## Завдання
Розширити сервер з homework_60 мідлварами для логування, обробки помилок, валідації даних та керування сесіями, підключивши їх до відповідних маршрутів.

## Що змінилося порівняно з homework_60
- `src/middlewares/logger.js` — логування (метод, URL, статус, час) — підключено до `GET /`.
- `src/middlewares/auth.js` — аутентифікація за заголовком `Authorization: Bearer <token>` — для всіх маршрутів `/users`.
- `src/middlewares/validation.js`:
  - `validateNumericParam('userId' | 'articleId')` — id має бути додатним цілим числом;
  - `validateUserBody` — для `POST/PUT /users`: `name` (мін. 2 символи), `email` (валідний), `age` (необов'язково, ціле ≥ 0);
  - `validateArticleBody` — для `POST/PUT /articles`: `title` (мін. 3 символи), `content`.
- `src/middlewares/access.js` — перевірка прав доступу за заголовком `X-User-Role` для `/articles`:
  - `GET` — `reader`, `editor`, `admin`;
  - `POST`, `PUT` — `editor`, `admin`;
  - `DELETE` — лише `admin`.
- `src/middlewares/session.js` — `express-session` (MemoryStore) + лічильник візитів у сесії; маршрут `/session`.
- `src/middlewares/errorHandler.js` — централізований обробник помилок, відповідає JSON `{ error, details? }`; обробляє невалідний JSON (400).
- `src/utils/HttpError.js` — клас помилки зі статус-кодом.
- Підтримка `.env` (`dotenv`), див. `.env.example`.

## Маршрути
| Метод | Шлях | Мідлвари |
|---|---|---|
| GET | `/` | logger |
| GET, POST | `/users` | authenticate (+ validateUserBody для POST) |
| GET, PUT, DELETE | `/users/:userId` | authenticate, validateNumericParam (+ validateUserBody для PUT) |
| GET, POST | `/articles` | checkArticleAccess (+ validateArticleBody для POST) |
| GET, PUT, DELETE | `/articles/:articleId` | checkArticleAccess, validateNumericParam (+ validateArticleBody для PUT) |
| GET | `/session` | інформація про поточну сесію (id, кількість візитів) |
| DELETE | `/session` | знищити сесію |

Коди помилок: `400` — помилка валідації / невалідний JSON, `401` — немає або невірний токен/роль, `403` — недостатньо прав, `404` — маршрут не знайдено, `500` — внутрішня помилка.

## Запуск
```bash
cp .env.example .env   # за бажанням змінити значення
npm install
npm start              # або npm run dev
```

## Приклади
```bash
curl -H "Authorization: Bearer secret-token" http://localhost:3000/users
curl -X POST -H "Authorization: Bearer secret-token" -H "Content-Type: application/json" \
     -d '{"name":"Ann","email":"ann@example.com"}' http://localhost:3000/users
curl -H "X-User-Role: reader" http://localhost:3000/articles
curl -X DELETE -H "X-User-Role: admin" http://localhost:3000/articles/3
```
