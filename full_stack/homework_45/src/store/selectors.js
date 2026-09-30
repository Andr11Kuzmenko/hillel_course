import { createSelector } from '@reduxjs/toolkit'

export const selectTodos = (state) => state.todos.items
export const selectFilter = (state) => state.filter

export const selectVisibleTodos = createSelector([selectTodos, selectFilter], (todos, filter) => {
  const query = filter.search.trim().toLowerCase()
  return todos
    .filter((t) => {
      if (filter.status === 'active') return !t.completed
      if (filter.status === 'completed') return t.completed
      return true
    })
    .filter((t) => t.title.toLowerCase().includes(query))
})

export const selectStats = createSelector([selectTodos], (todos) => {
  const completed = todos.filter((t) => t.completed).length
  return { total: todos.length, completed, active: todos.length - completed }
})
