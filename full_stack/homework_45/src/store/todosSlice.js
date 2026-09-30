import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  items: [
    { id: nanoid(), title: 'Встановити @reduxjs/toolkit та react-redux', completed: true },
    { id: nanoid(), title: 'Створити store через configureStore', completed: true },
    { id: nanoid(), title: 'Перенести стан todo у slice', completed: false },
  ],
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // prepare формує payload, тож компонент передає лише текст
    addTodo: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare(title) {
        return { payload: { id: nanoid(), title, completed: false } }
      },
    },
    toggleTodo(state, action) {
      const todo = state.items.find((t) => t.id === action.payload)
      if (todo) todo.completed = !todo.completed
    },
    editTodo(state, action) {
      const { id, title } = action.payload
      const todo = state.items.find((t) => t.id === id)
      if (todo) todo.title = title
    },
    removeTodo(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
    toggleAll(state) {
      const allDone = state.items.every((t) => t.completed)
      state.items.forEach((t) => {
        t.completed = !allDone
      })
    },
    clearCompleted(state) {
      state.items = state.items.filter((t) => !t.completed)
    },
  },
})

export const { addTodo, toggleTodo, editTodo, removeTodo, toggleAll, clearCompleted } =
  todosSlice.actions
export default todosSlice.reducer
