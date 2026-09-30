# Домашнє завдання 43 — Вступ до маршрутизації в React з використанням React Router

## Завдання

- Встановити `react-router` (v7).
- У `src/components` створити `Home.jsx`, `About.jsx`, `Contact.jsx`, кожен з унікальним текстом.
- Налаштувати маршрутизацію через `BrowserRouter` і `Routes`.
- Додати навігаційне меню з `NavLink` і підсвічуванням активного пункту.
- Додати сторінку 404 та приклад динамічного маршруту.

## Реалізація

| Маршрут | Компонент |
|---|---|
| `/` | `Home` |
| `/about` | `About` |
| `/contact` | `Contact` |
| `/users` | `Users` — список користувачів |
| `/users/:id` | `UserDetails` — динамічний маршрут, `useParams` |
| `*` | `NotFound` — сторінка 404 |

`Layout.jsx` містить навігацію (`NavLink`) та `<Outlet />` для вкладених маршрутів.

## Запуск

```bash
npm install && npm run dev
```

Інші команди: `npm run build` — збірка, `npm run lint` — перевірка ESLint, `npm run preview` — перегляд збірки.
