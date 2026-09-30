# Homework 63 — Робота зі статичними файлами, Cookies та JWT

## Завдання
1. **Статичні файли:** додати `favicon.ico`, роздавати папку `public` через `express.static` і підключити іконку в усіх шаблонах PUG та EJS.
2. **Cookies:** зберігати налаштування користувача (тема `light` / `dark`) у cookies та використовувати їх у шаблонах.
3. **JWT:** реєстрація та вхід з видачею JSON Web Token, збереження токена в httpOnly-cookie, захищені маршрути, вихід.

## Що змінилося порівняно з homework_62
- **Статика:** `public/favicon.ico` (16×16, 32 bpp) згенеровано скриптом `scripts/generate-favicon.js` (`npm run favicon`) без сторонніх бібліотек; `public/css/style.css` — спільні стилі (замість inline-стилів). У `layout.pug` і `partials/header.ejs` додано `<link rel="icon" href="/favicon.ico">`.
- **Cookies (`cookie-parser`):**
  - `src/middlewares/preferences.js` — читає cookie `theme` і передає `theme` у шаблони через `res.locals`;
  - `src/routes/preferences.routes.js` — встановлення/скидання теми; `<body class="theme-dark">` вмикає темну палітру; перемикач теми в меню.
- **JWT (`jsonwebtoken`, `bcryptjs`):**
  - `src/models/accounts.model.js` — облікові записи в пам'яті, пароль зберігається лише як bcrypt-хеш;
  - `src/utils/jwt.js` — підпис/перевірка токена, налаштування cookie (`httpOnly`, `sameSite=lax`, `secure` у production);
  - `src/middlewares/jwtAuth.js` — `attachUser` (глобально декодує токен з cookie `token` або `Authorization: Bearer <jwt>`) і `requireJwt` (захист маршрутів: браузер → редирект на `/auth/login`, API → 401);
  - сторінки `auth/login.pug`, `auth/register.pug`, `protected.pug`.
- `POST/PUT/DELETE /users` тепер приймають **або** JWT залогіненого користувача, **або** статичний `API_TOKEN` (як у hw 61/62).

## Маршрути
| Метод | Шлях | Опис |
|---|---|---|
| GET | `/favicon.ico`, `/css/style.css` | статичні файли |
| GET | `/` | головна (PUG) |
| GET | `/users`, `/users/:userId` | сторінки користувачів (PUG) / JSON з `Accept: application/json` |
| POST, PUT, DELETE | `/users`, `/users/:userId` | CRUD (JWT або `Authorization: Bearer <API_TOKEN>`) |
| GET | `/articles`, `/articles/:articleId` | сторінки статей (EJS) |
| POST, PUT, DELETE | `/articles`, `/articles/:articleId` | CRUD (заголовок `X-User-Role`) |
| GET | `/preferences` | поточні налаштування (JSON) |
| GET | `/preferences/theme/:theme?redirect=/path` | встановити тему (`light`/`dark`) і повернутися на сторінку |
| POST | `/preferences/theme` | встановити тему, тіло `{ "theme": "dark" }` |
| DELETE | `/preferences` | скинути налаштування |
| GET, POST | `/auth/register` | форма / реєстрація (`{ name?, email, password }`) → JWT у cookie |
| GET, POST | `/auth/login` | форма / вхід (`{ email, password }`) → JWT у cookie |
| GET, POST | `/auth/logout` | вихід (очищення cookie `token`) |
| GET | `/auth/me` | профіль поточного користувача (захищено JWT) |
| GET | `/protected` | захищена сторінка (JWT) |
| GET, DELETE | `/session` | сесія (з hw 61) |

POST-маршрути `/auth/*` працюють і з HTML-формами (редирект), і з JSON (відповідь JSON; у ній також повертається `token` для використання в заголовку `Authorization`).

## Запуск
```bash
cp .env.example .env   # задати JWT_SECRET
npm install
npm start              # або npm run dev
```
Відкрити http://localhost:3000, зареєструватися, перейти на `/protected`, перемкнути тему.

```bash
curl -c cookies.txt -H "Content-Type: application/json" \
     -d '{"email":"ann@example.com","password":"secret1"}' http://localhost:3000/auth/register
curl -b cookies.txt http://localhost:3000/auth/me
curl -b cookies.txt -H "Accept: application/json" http://localhost:3000/protected
```
