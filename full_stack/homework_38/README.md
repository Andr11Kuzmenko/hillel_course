# Домашнє завдання 38 — Ініціалізація та налаштування React проекту

## Завдання

- Створити React-проєкт (Vite).
- У папці `src/components` створити компоненти `Button.jsx` та `Input.jsx`.
- Компоненти приймають і використовують props:
  - **Button** — `text`, `type` (`button` / `submit`), а також `variant`, `disabled`, `onClick`;
  - **Input** — `placeholder`, `type`, `value`, `onChange`, а також `label`, `name`, `required`.
- Використати компоненти в `App.jsx` кілька разів із різними props.
- Додати перевірку типів через **PropTypes** та значення за замовчуванням.

## Реалізація

- `src/components/Button.jsx` — кнопка з варіантами оформлення (primary / secondary / danger).
- `src/components/Input.jsx` — поле введення з підписом.
- `src/App.jsx` — форма реєстрації (контрольовані Input + кнопки submit/button), набір кнопок із різними props, а також компоненти без props для демонстрації значень за замовчуванням.

## Запуск

```bash
npm install && npm run dev
```

Інші команди: `npm run build` — збірка, `npm run lint` — перевірка ESLint, `npm run preview` — перегляд збірки.
