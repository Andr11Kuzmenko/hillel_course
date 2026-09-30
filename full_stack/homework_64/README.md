# Homework 64 — Оновлення сервера Express з використанням Passport для авторизації

## Завдання
Інтегрувати `passport` із `passport-local` (вхід за email і паролем), реалізувати реєстрацію, вхід і вихід через Passport, зберігати стан автентифікації в сесії (`express-session`, `serializeUser` / `deserializeUser`) та захистити маршрути мідлварою `ensureAuthenticated`.

## Що змінилося порівняно з homework_63
- **JWT замінено на Passport + сесії.** Залежність `jsonwebtoken`, `src/utils/jwt.js` та `src/middlewares/jwtAuth.js` видалено: для серверного рендерингу сесія зручніша, а два паралельні механізми входу лише ускладнили б код.
- `src/auth/passport.js` — `LocalStrategy` з `usernameField: 'email'`, перевірка пароля через `bcryptjs`; `serializeUser` зберігає в сесії лише `id`, `deserializeUser` відновлює користувача (без хешу пароля) на кожен запит.
- `src/middlewares/session.js` — сесійна cookie `sid` (`httpOnly`, `sameSite=lax`, `secure` у production, 24 год), `saveUninitialized: false`.
- `src/app.js` — порядок: `express-session` → `passport.initialize()` → `passport.session()`.
- `src/middlewares/ensureAuthenticated.js`:
  - `ensureAuthenticated` — пропускає лише залогінених (браузер → редирект на `/auth/login?next=...`, API → 401);
  - `ensureGuest` — залогінений користувач зі сторінок входу/реєстрації перенаправляється в `/profile`;
  - `exposeUser` — передає `currentUser` у шаблони (PUG та EJS).
- `src/controllers/auth.controller.js` — реєстрація (після створення акаунта одразу `req.login`), вхід через `passport.authenticate('local', callback)`, вихід через `req.logout()`. Підтримуються і HTML-форми, і JSON.
- Нові сторінки: `profile.pug`; оновлено `protected.pug`, меню (Profile, Login/Register/Logout).
- `POST/PUT/DELETE /users` приймають **або** Passport-сесію, **або** статичний `API_TOKEN`.
- Без змін: favicon та статика, тема в cookies, PUG/EJS-шаблони, мідлвари логування/валідації/прав доступу.

## Маршрути
| Метод | Шлях | Опис |
|---|---|---|
| GET | `/` | головна (PUG) |
| GET | `/auth/register` | форма реєстрації |
| POST | `/auth/register` | реєстрація `{ name?, email, password }` + автоматичний вхід |
| GET | `/auth/login` | форма входу |
| POST | `/auth/login` | вхід через Passport local `{ email, password }` |
| GET, POST | `/auth/logout` | вихід |
| GET | `/profile` | профіль (**ensureAuthenticated**) |
| GET | `/protected` | захищена сторінка (**ensureAuthenticated**) |
| GET | `/users`, `/users/:userId` | сторінки користувачів (PUG) |
| POST, PUT, DELETE | `/users`, `/users/:userId` | CRUD (сесія або `Authorization: Bearer <API_TOKEN>`) |
| GET | `/articles`, `/articles/:articleId` | сторінки статей (EJS) |
| POST, PUT, DELETE | `/articles`, `/articles/:articleId` | CRUD (заголовок `X-User-Role`) |
| GET, POST, DELETE | `/preferences`, `/preferences/theme/:theme`, `/preferences/theme` | тема в cookies |
| GET, DELETE | `/session` | інформація про сесію |

## Запуск
```bash
cp .env.example .env   # задати SESSION_SECRET
npm install
npm start              # або npm run dev
```
Відкрити http://localhost:3000/auth/register, зареєструватися → `/profile`.

```bash
curl -c c.txt -H "Content-Type: application/json" \
     -d '{"email":"ann@example.com","password":"secret1"}' http://localhost:3000/auth/register
curl -b c.txt -H "Accept: application/json" http://localhost:3000/profile
curl -b c.txt -X POST http://localhost:3000/auth/logout
```

> Користувачі зберігаються в пам'яті — після перезапуску сервера потрібно зареєструватися знову.
