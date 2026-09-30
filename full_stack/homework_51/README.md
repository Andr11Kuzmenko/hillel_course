# Homework 51 — Розширення можливостей React-додатків: інтеграція спеціалізованих бібліотек

## Завдання

Створити новий (або покращити існуючий) React-застосунок на вільну тему, який демонструє
вивчені технології та **обов'язково використовує спеціалізовані бібліотеки** для роутингу,
роботи з API, графіків, дат, сповіщень і форм.

## Тема: CryptoBoard — криптовалютний дашборд

- **Ринок** (`/`) — KPI (капіталізація, лідер росту/падіння), стовпчикова діаграма зміни ціни
  за 24 год, таблиця топ-30 монет з пошуком і сортуванням.
- **Сторінка монети** (`/coin/:id`) — детальна інформація та графік ціни за 24г / 7д / 30д / 90д.
- **Портфель** (`/portfolio`) — форма додавання позиції з валідацією, розрахунок вартості та
  прибутку/збитку за поточними цінами, кругова діаграма розподілу активів, збереження в `localStorage`.
- **404** для невідомих маршрутів.

Дані — публічний API [CoinGecko](https://www.coingecko.com/en/api) (без ключа).
Якщо API недоступне (ліміт запитів, офлайн), застосунок показує **резервні дані**
(`src/data/fallbackCoins.js`) та змодельований графік, про що повідомляє toast і мітка «резервні дані».

## Використані бібліотеки

| Бібліотека | Для чого | Де |
|------------|----------|----|
| **react-router-dom** | Маршрутизація, вкладені роути, `NavLink`, `useParams`, `useNavigate` | `App.jsx`, `components/Layout.jsx`, сторінки |
| **axios** | HTTP-клієнт: `axios.create`, `params`, `timeout`, interceptor для обробки помилок | `src/api/coingecko.js` |
| **recharts** | `AreaChart` (ціна), `BarChart` (зміна 24г), `PieChart` (розподіл портфеля) | `pages/*` |
| **date-fns** (+ локаль `uk`) | Форматування дат на осях і в таблицях, «оновлено 2 хвилини тому» | `src/utils/format.js`, `HoldingForm.jsx` |
| **react-toastify** | Сповіщення про оновлення, помилки API, додавання/видалення позицій | `Layout.jsx`, `MarketContext.jsx`, сторінки |
| **react-hook-form** | Форма портфеля: `register`, правила `required/min/max/validate`, `watch`, `setValue`, `reset` | `components/HoldingForm.jsx` |

Також використано: Context API (`MarketContext`), кастомні хуки (`useMarket`, `useLocalStorage`),
`useMemo` для похідних даних, `prop-types`.

## Структура

```
src/
  api/coingecko.js        # axios-клієнт
  context/MarketContext.jsx
  hooks/useLocalStorage.js
  data/fallbackCoins.js   # резервні дані
  utils/format.js         # date-fns + Intl
  components/             # Layout, HoldingForm, CoinIcon, PriceChange, Loader
  pages/                  # DashboardPage, CoinPage, PortfolioPage, NotFoundPage
```

## Запуск

```bash
npm install
npm run dev
npm run build
npm run preview
```
