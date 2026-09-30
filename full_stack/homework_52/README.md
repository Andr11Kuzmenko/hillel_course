# Homework 52 — Курсовий проект з React і Redux Toolkit

## Завдання

Розробити проєкт на Vite + React середньої/високої складності, що демонструє роботу
React разом із **Redux Toolkit** (приклади тем: інтернет-магазин, блог, менеджер задач, фінансовий трекер).

## Тема: MiniShop — міні інтернет-магазин

### Функціональність

- **Каталог** (`/`) — товари з [fakestoreapi.com](https://fakestoreapi.com/products),
  пошук (за назвою та описом), фільтр за категорією, фільтр за максимальною ціною (слайдер), сортування.
- **Сторінка товару** (`/product/:id`) — опис, рейтинг, вибір кількості, додавання в кошик, схожі товари.
- **Кошик** (`/cart`) — зміна кількості (± та ручне введення, 1..99), видалення, очищення,
  підсумок: сума, доставка (безкоштовно від $100), до сплати.
- **Оформлення замовлення** (`/checkout`) — форма з валідацією (ім'я, email, телефон, місто,
  адреса, спосіб оплати, дані картки з маскою, коментар, згода); помилки показуються після `blur`
  та при спробі відправки.
- **Підтвердження** (`/order/:orderId`) та **історія замовлень** (`/orders`).
- **404** для невідомих маршрутів.
- Кошик та замовлення **зберігаються в localStorage** і відновлюються після перезавантаження.
- Якщо API недоступне — показуються **резервні mock-дані** (`src/data/mockProducts.js`) з банером-попередженням.
- Адаптивна верстка (desktop / tablet / mobile).

### Redux Toolkit

| Slice | Що зберігає | Ключові можливості RTK |
|-------|-------------|------------------------|
| `products` | товари, статус, помилка, `isFallback` | `createAsyncThunk` (`fetchProducts` з `condition`, `rejectWithValue`, `AbortSignal`), `createEntityAdapter`, `extraReducers` (pending/fulfilled/rejected → fallback) |
| `filters` | пошук, категорія, сортування, макс. ціна | прості reducers, `resetFilters` |
| `cart` | позиції кошика | `prepare`-callback в `addToCart`, мутуючий синтаксис Immer, реакція на `placeOrder.fulfilled` (очищення) |
| `orders` | історія замовлень | `createAsyncThunk` `placeOrder` (імітація запиту), `unwrap()` у компоненті |

**Селектори** (`createSelector`): `selectFilteredProducts`, `selectCategories`, `selectPriceBounds`,
`selectRelatedProducts`, `selectCartCount`, `selectCartTotals` — похідні дані обчислюються
мемоізовано і не спричиняють зайвих рендерів.

**Store** (`src/app/store.js`): `configureStore`, `preloadedState` з localStorage,
`store.subscribe` з debounce для збереження `cart` та `orders`.

### Структура

```
src/
  app/store.js
  features/
    products/productsSlice.js (+ test)
    filters/filtersSlice.js
    cart/cartSlice.js (+ test)
    orders/ordersSlice.js
  components/   # Layout, ProductCard, FiltersBar, CartSummary, QuantityControl, Rating, ProductImage, Loader
  pages/        # Catalog, Product, Cart, Checkout, OrderSuccess, Orders, NotFound
  data/mockProducts.js
  utils/        # format, storage, validation (+ test)
```

### Технології

React 18, Redux Toolkit 2, React Redux 9, React Router 6, Vite 6, Vitest (unit-тести slices та валідації).

## Запуск

```bash
npm install
npm run dev
npm test       # unit-тести reducers / selectors / валідації
npm run build
npm run preview
```
