# Homework 49 — Тестування асинхронної логіки React-компонентів

## Завдання

Компонент `src/components/UserProfile.jsx` виконує асинхронний GET-запит до
`https://jsonplaceholder.typicode.com/users/1` (ID можна передати через проп `userId`),
отримує дані користувача (ім'я, username, email, телефон, сайт, місто, компанію) і відображає:

- стан завантаження (`role="status"` — «Завантаження...»);
- стан помилки (`role="alert"` — «Помилка: ...»), зокрема при статусі відповіді не 2xx та збої мережі;
- картку з даними користувача після успішного запиту.

Потрібно написати тести, що перевіряють асинхронну поведінку компонента з мокуванням `fetch`.

## Технології

- Vite + React 18
- Vitest + jsdom
- @testing-library/react, @testing-library/jest-dom, @testing-library/user-event

## Що перевіряють тести

`src/components/UserProfile.test.jsx` (fetch мокається через `vi.spyOn(globalThis, 'fetch')`):

1. Відображення стану завантаження одразу після рендеру.
2. `fetch` викликається один раз з правильним URL (`/users/1`).
3. Проп `userId` підставляється в URL.
4. Успішне відображення даних (`findByRole` / `findByText`), відсутність лоадера і помилки.
5. Помилка при неуспішному статусі відповіді (404).
6. Помилка при збої мережі (`mockRejectedValueOnce`, перевірка через `waitFor`).
7. Повторний запит при зміні `userId` (`rerender`).

`src/App.test.jsx` — інтеграційний тест: `vi.stubGlobal('fetch', vi.fn(...))`, клік по кнопці
іншого користувача запускає новий запит.

## Запуск

```bash
npm install
npm test          # одноразовий запуск тестів (vitest run)
npm run test:watch
npm run dev       # запуск застосунку
npm run build
```
