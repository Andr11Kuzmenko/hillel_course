# Домашнє завдання 42 — Розробка з використанням хука useEffect і Axios

## Завдання

- Встановити бібліотеку **axios**.
- Створити компонент `src/components/DataFetcher.jsx`, який за допомогою `useEffect` виконує асинхронний запит при першому монтуванні.
- Відобразити стан завантаження, помилку та отримані дані.

## Реалізація

- `src/api/client.js` — екземпляр axios з `baseURL` `https://jsonplaceholder.typicode.com`.
- `src/components/DataFetcher.jsx` — завантажує пости в `useEffect`, показує лоадер / помилку / список; скасовує запит через `AbortController` у функції очищення; дозволяє змінити кількість постів, оновити дані та імітувати помилку (запит на неіснуючий endpoint).
- `src/components/PostCard.jsx` — картка одного поста.

## Запуск

```bash
npm install && npm run dev
```

Інші команди: `npm run build` — збірка, `npm run lint` — перевірка ESLint, `npm run preview` — перегляд збірки.
