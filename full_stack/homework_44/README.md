# Homework 44 — Використання React Context у багаторівневій архітектурі компонентів

## Завдання

Створити застосунок на React, у якому глобальні дані передаються через **React Context**
компонентам на різних рівнях вкладеності без prop drilling.

## Реалізація

- `src/context/AppContext.jsx`:
  - `createContext(defaultAppContext)` — значення за замовчуванням описує форму контексту
    (порожній список, `theme: 'light'`, функції-заглушки з попередженням у консолі, якщо провайдера немає);
  - `AppProvider` зберігає стан (список користувачів, обраний користувач, тема) та функції для його зміни:
    `toggleTheme`, `selectUser`, `addUser`, `removeUser`, `toggleUserActive`, `updateUser`.
    Значення мемоізоване через `useMemo`/`useCallback`;
  - кастомний хук `useAppContext()` на основі `useContext`.
- Дерево компонентів:

  ```
  App (AppProvider)
  └── Layout            — тема (клас theme-light / theme-dark)
      ├── Header        — лічильник активних, обраний користувач
      │   └── ThemeToggle
      ├── Sidebar       — не використовує контекст, лише компонує дітей
      │   ├── UserList
      │   │   └── UserItem   — вибір, активація, видалення
      │   └── AddUserForm
      └── MainContent
          └── UserDetails
              └── EditUserForm
  ```

  Жоден компонент не отримує дані контексту через props — кожен бере їх напряму з `useAppContext()`
  (єдиний prop — `user` для елемента списку в `map`).
- Перемикання світлої/темної теми через CSS-змінні.

## Запуск

```bash
npm install
npm run dev      # dev-сервер Vite (http://localhost:5173)
npm run build    # продакшн-збірка у dist/
npm run preview  # перегляд збірки
npm run lint     # перевірка ESLint
```
