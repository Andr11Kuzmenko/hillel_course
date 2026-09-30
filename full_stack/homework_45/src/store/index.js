import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './todosSlice.js'
import filterReducer from './filterSlice.js'

const STORAGE_KEY = 'hw45-state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filter: filterReducer,
  },
  preloadedState: loadState(),
})

// Зберігаємо стан у localStorage при кожній зміні
store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()))
  } catch {
    // ignore
  }
})
