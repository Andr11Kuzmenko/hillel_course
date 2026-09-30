import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './todosSlice.js'
import filterReducer from './filterSlice.js'

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filter: filterReducer,
  },
})
