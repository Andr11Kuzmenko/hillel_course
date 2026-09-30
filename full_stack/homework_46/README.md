# Homework 46 — Рефакторинг Redux Toolkit проекту з використанням асинхронних дій

## Завдання

Визначити частини Redux-застосунку, яким потрібні асинхронні операції (робота з API), і переписати їх
з використанням `createAsyncThunk`, обробивши стани `pending` / `fulfilled` / `rejected`.

## Реалізація

Todo-застосунок (на основі homework_45), який працює з API
[JSONPlaceholder](https://jsonplaceholder.typicode.com/todos).

- `src/api/todosApi.js` — обгортка над `fetch` (GET / POST / PATCH / DELETE) з перевіркою `response.ok`.
- `src/store/todosSlice.js` — асинхронні дії:
  - `fetchTodos` — завантаження списку (з `condition`, щоб не дублювати запит);
  - `addTodo` — POST;
  - `toggleTodo`, `updateTodoTitle` — PATCH;
  - `deleteTodo` — DELETE.

  Усі помилки передаються через `rejectWithValue`. У `extraReducers` обробляються всі три стани кожного thunk.
  Стан слайса: `status` (`idle | loading | succeeded | failed`), `error`, `adding`,
  `pendingIds` (завдання, для яких триває запит), `mutationError`.
- UI: спінер під час завантаження, повідомлення про помилку з кнопкою «Спробувати ще раз»,
  блокування елемента під час запиту, банер помилок операцій, кнопка перезавантаження списку.
  `TodoForm` використовує `dispatch(...).unwrap()` і очищує поле лише після успішного запиту.

> JSONPlaceholder не зберігає зміни і завжди повертає `id: 201` для нових записів, а PATCH для
> неіснуючих id повертає помилку. Тому новим завданням присвоюється локальний унікальний id і прапорець
> `local`, і для них PATCH/DELETE виконуються лише в store. Після перезавантаження список повертається
> до початкового стану — це очікувана поведінка фейкового API.

## Запуск

```bash
npm install
npm run dev      # dev-сервер Vite (http://localhost:5173)
npm run build    # продакшн-збірка у dist/
npm run preview  # перегляд збірки
npm run lint     # перевірка ESLint
```
