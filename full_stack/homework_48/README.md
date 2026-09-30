# Homework 48 — Інтеграція Material UI у React проект

## Завдання

Інтегрувати UI-бібліотеку (Material UI / Tailwind CSS / Ant Design) у React-проєкт.
Обрано **Material UI** (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`).

## Реалізація

Адаптивний застосунок «CourseHub» — каталог онлайн-курсів.

- **Тема** (`src/theme.js`): `createTheme` з власною палітрою для світлого й темного режимів,
  типографікою, `shape.borderRadius` і перевизначенням компонентів (`MuiAppBar`, `MuiCard`, `MuiButton`).
  `ThemeProvider` + `CssBaseline`; початковий режим береться з системних налаштувань
  (`useMediaQuery('(prefers-color-scheme: dark)')`), перемикач у шапці.
- **AppBar / Toolbar** (`AppHeader`): кнопка меню (на мобільних), `Badge` з кількістю обраних,
  перемикач теми з `Tooltip`, `Avatar` + `Menu` профілю.
- **Drawer** (`NavDrawer`): постійний на десктопі, тимчасовий на мобільних; `List` з навігацією
  (Каталог / Таблиця / Обрані) та фільтром за категоріями.
- **Container / Grid2 / Stack**: адаптивна сітка карток і блок статистики (`Paper`).
- **Card** (`CourseCard`): `CardHeader`, `Chip`, `Rating`, `CardActions` з кнопками.
- **Table** (`CoursesTable`): сортування (`TableSortLabel`) і пагінація (`TablePagination`).
- **Dialog + TextField** (`CourseDialog`): форма додавання/редагування курсу з валідацією
  (`error` / `helperText`), select-поле, `InputAdornment`; окремий діалог підтвердження видалення.
- **Snackbar + Alert**: сповіщення про додавання, оновлення, видалення.
- **Fab** — кнопка додавання на мобільних; пошук через `TextField` з іконкою.

## Запуск

```bash
npm install
npm run dev      # dev-сервер Vite (http://localhost:5173)
npm run build    # продакшн-збірка у dist/
npm run preview  # перегляд збірки
npm run lint     # перевірка ESLint
```

> Під час збірки Vite може попередити про розмір чанка > 500 kB — це через бібліотеку MUI, на роботу не впливає.
