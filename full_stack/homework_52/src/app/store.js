import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products/productsSlice.js'
import filtersReducer from '../features/filters/filtersSlice.js'
import cartReducer from '../features/cart/cartSlice.js'
import ordersReducer from '../features/orders/ordersSlice.js'
import { loadState, saveState } from '../utils/storage.js'

export const rootReducer = {
  products: productsReducer,
  filters: filtersReducer,
  cart: cartReducer,
  orders: ordersReducer,
}

export function setupStore(preloadedState) {
  return configureStore({ reducer: rootReducer, preloadedState })
}

const persisted = loadState()
export const store = setupStore(persisted)

// Зберігаємо кошик і замовлення в localStorage (з простим debounce)
let timer
store.subscribe(() => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const { cart, orders } = store.getState()
    saveState({ cart, orders })
  }, 300)
})
