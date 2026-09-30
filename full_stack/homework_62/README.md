# Homework 62 — Інтеграція шаблонізаторів PUG та EJS

## Завдання
Інтегрувати в Express-сервер шаблонізатори PUG та EJS:
- `/users` та `/users/:userId` — рендеряться через **PUG** (список + сторінка користувача);
- `/articles` та `/articles/:articleId` — рендеряться через **EJS** (список + сторінка статті).

## Що змінилося порівняно з homework_61
- Додано залежності `pug`, `ejs`. PUG — движок за замовчуванням (`app.set('view engine', 'pug')`), EJS-шаблони рендеряться із явним розширенням (`res.render('articles/list.ejs')`) — Express сам підключає потрібний движок за розширенням файлу.
- `src/models/` — in-memory моделі з mock-даними (`users.model.js`, `articles.model.js`) з операціями findAll / findById / create / update / remove.
- Контролери тепер працюють з моделями: GET рендерить HTML-сторінку (або JSON, якщо клієнт надсилає `Accept: application/json`), POST/PUT/DELETE змінюють дані в пам'яті та повертають JSON.
- `src/views/`:
  - `layout.pug`, `index.pug`, `error.pug`, `users/list.pug`, `users/detail.pug`, `partials/styles.pug`;
  - `articles/list.ejs`, `articles/detail.ejs`, `partials/header.ejs`, `partials/footer.ejs`.
- Обробник помилок рендерить сторінку `error.pug` для браузера та JSON для API-клієнтів.
- **Зміни в мідлварах, щоб сторінки відкривались у браузері:**
  - `/users`: GET — публічний, `POST/PUT/DELETE` — вимагають `Authorization: Bearer <API_TOKEN>`;
  - `/articles`: для GET без заголовка `X-User-Role` роль за замовчуванням — `reader`; `POST/PUT` — `editor`/`admin`, `DELETE` — `admin`;
  - валідація id та тіла запиту, логування `GET /`, сесії — без змін.

## Маршрути
| Метод | Шлях | Опис |
|---|---|---|
| GET | `/` | головна сторінка (PUG) |
| GET | `/users` | список користувачів (PUG) |
| GET | `/users/:userId` | сторінка користувача (PUG) |
| POST | `/users` | створити користувача (Bearer-токен, JSON `{ name, email, age?, city? }`) |
| PUT | `/users/:userId` | оновити користувача (Bearer-токен) |
| DELETE | `/users/:userId` | видалити користувача (Bearer-токен) |
| GET | `/articles` | список статей (EJS) |
| GET | `/articles/:articleId` | сторінка статті (EJS) |
| POST | `/articles` | створити статтю (`X-User-Role: editor/admin`, JSON `{ title, content, author?, tags? }`) |
| PUT | `/articles/:articleId` | оновити статтю (`editor/admin`) |
| DELETE | `/articles/:articleId` | видалити статтю (`admin`) |
| GET / DELETE | `/session` | інформація про сесію / знищення сесії |

## Запуск
```bash
cp .env.example .env
npm install
npm start          # або npm run dev
```
Відкрити в браузері: http://localhost:3000/users, http://localhost:3000/articles

```bash
curl -H "Accept: application/json" http://localhost:3000/users
curl -X POST -H "Authorization: Bearer secret-token" -H "Content-Type: application/json" \
     -d '{"name":"Ann","email":"ann@example.com"}' http://localhost:3000/users
curl -X POST -H "X-User-Role: editor" -H "Content-Type: application/json" \
     -d '{"title":"New article","content":"Text","tags":"node,express"}' http://localhost:3000/articles
```
