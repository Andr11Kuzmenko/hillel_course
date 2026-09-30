# Домашнє завдання 41 — Робота з хуком use() в React

## Завдання

- Використати **React 19** та хук `use()`.
- Створити функцію, що повертає Promise із затримкою (імітація асинхронного запиту).
- У `src/components/MessageComponent.jsx` прочитати дані з Promise через `use()`.
- Обгорнути компонент у `<Suspense fallback={...}>`.
- Додати `ErrorBoundary` для випадку відхиленого Promise.
- Продемонструвати використання `use()` з контекстом.

## Реалізація

- `src/api/messages.js` — `fetchMessage({ delay, shouldFail })` і `fetchUsers()` повертають Promise із затримкою.
- `src/components/MessageComponent.jsx` — `use(messagePromise)` + `use(ThemeContext)`.
- `src/components/UserList.jsx` — ще один приклад читання Promise.
- `src/components/ThemeBadge.jsx` — умовний виклик `use(ThemeContext)` (неможливо з `useContext`).
- `src/components/ErrorBoundary.jsx` — класовий компонент для перехоплення помилок із кнопкою повтору.
- Promise створюються поза рендером (на рівні модуля або через ліниву ініціалізацію `useState` / в обробниках подій), щоб уникнути нескінченного циклу призупинень.
- Контекст надається через `<ThemeContext value={theme}>` (новий синтаксис React 19).

## Запуск

```bash
npm install && npm run dev
```

Інші команди: `npm run build` — збірка, `npm run lint` — перевірка ESLint, `npm run preview` — перегляд збірки.
