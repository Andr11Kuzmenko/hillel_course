# Homework 45 — Інтеграція Redux у існуючий React проект

## Завдання

Взяти простий React-проєкт, де стан передавався через props / Context, і перенести глобальний стан
у **Redux** за допомогою `@reduxjs/toolkit` та `react-redux`.

## Реалізація

Todo-застосунок. Раніше `App` тримав `todos` і `filter` у `useState` і передавав їх разом
з колбеками через props; тепер стан живе у Redux store.

- `src/store/index.js` — `configureStore` з двома редюсерами, збереження стану в `localStorage`.
- `src/store/todosSlice.js` — `createSlice`: `addTodo` (з `prepare` + `nanoid`), `toggleTodo`,
  `editTodo`, `removeTodo`, `toggleAll`, `clearCompleted`.
- `src/store/filterSlice.js` — фільтр за статусом (усі / активні / виконані) та пошук.
- `src/store/selectors.js` — мемоізовані селектори (`createSelector`): видимі завдання та статистика.
- `src/main.jsx` — `<Provider store={store}>`.
- Компоненти `TodoForm`, `FilterBar`, `TodoList`, `TodoItem`, `TodoStats` читають стан через
  `useSelector` і змінюють через `useDispatch` — без props-ланцюжків.
- Редагування завдання — подвійним кліком або кнопкою ✎ (Enter — зберегти, Esc — скасувати).

## Запуск

```bash
npm install
npm run dev      # dev-сервер Vite (http://localhost:5173)
npm run build    # продакшн-збірка у dist/
npm run preview  # перегляд збірки
npm run lint     # перевірка ESLint
```
