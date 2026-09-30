import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { todosApi } from '../api/todosApi.js'

// JSONPlaceholder — фейковий API: він не зберігає зміни і завжди повертає id 201
// для нових записів, а PATCH для неіснуючих id (>200) відповідає помилкою.
// Тому створені локально завдання позначаються прапорцем `local`, і для них
// PATCH/DELETE не відправляються на сервер.
const getErrorMessage = (error) => error?.message ?? 'Невідома помилка'

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (limit = 10, { rejectWithValue }) => {
    try {
      return await todosApi.getAll(limit)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
  {
    // не запускаємо повторне завантаження, якщо воно вже триває
    condition: (_, { getState }) => getState().todos.status !== 'loading',
  },
)

export const addTodo = createAsyncThunk('todos/addTodo', async (title, { rejectWithValue }) => {
  try {
    const created = await todosApi.create({ title, completed: false, userId: 1 })
    return { ...created, id: Date.now(), local: true }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (id, { getState, rejectWithValue }) => {
    const todo = getState().todos.items.find((t) => t.id === id)
    const changes = { completed: !todo.completed }
    if (todo.local) return { id, ...changes }
    try {
      const updated = await todosApi.update(id, changes)
      return { id, completed: updated.completed }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const updateTodoTitle = createAsyncThunk(
  'todos/updateTodoTitle',
  async ({ id, title }, { getState, rejectWithValue }) => {
    const todo = getState().todos.items.find((t) => t.id === id)
    if (todo.local) return { id, title }
    try {
      const updated = await todosApi.update(id, { title })
      return { id, title: updated.title }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { getState, rejectWithValue }) => {
    const todo = getState().todos.items.find((t) => t.id === id)
    if (todo.local) return id
    try {
      await todosApi.remove(id)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' — для завантаження списку
  error: null,
  adding: false, // очікування відповіді на POST
  pendingIds: [], // id завдань, для яких виконується PATCH/DELETE
  mutationError: null, // помилка останньої операції зміни
}

const addPending = (state, id) => {
  if (!state.pendingIds.includes(id)) state.pendingIds.push(id)
}
const removePending = (state, id) => {
  state.pendingIds = state.pendingIds.filter((pid) => pid !== id)
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearMutationError(state) {
      state.mutationError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchTodos ---
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })

      // --- addTodo ---
      .addCase(addTodo.pending, (state) => {
        state.adding = true
        state.mutationError = null
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.adding = false
        state.items.unshift(action.payload)
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.adding = false
        state.mutationError = action.payload ?? action.error.message
      })

      // --- toggleTodo ---
      .addCase(toggleTodo.pending, (state, action) => {
        addPending(state, action.meta.arg)
        state.mutationError = null
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        removePending(state, action.payload.id)
        const todo = state.items.find((t) => t.id === action.payload.id)
        if (todo) todo.completed = action.payload.completed
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        removePending(state, action.meta.arg)
        state.mutationError = action.payload ?? action.error.message
      })

      // --- updateTodoTitle ---
      .addCase(updateTodoTitle.pending, (state, action) => {
        addPending(state, action.meta.arg.id)
        state.mutationError = null
      })
      .addCase(updateTodoTitle.fulfilled, (state, action) => {
        removePending(state, action.payload.id)
        const todo = state.items.find((t) => t.id === action.payload.id)
        if (todo) todo.title = action.payload.title
      })
      .addCase(updateTodoTitle.rejected, (state, action) => {
        removePending(state, action.meta.arg.id)
        state.mutationError = action.payload ?? action.error.message
      })

      // --- deleteTodo ---
      .addCase(deleteTodo.pending, (state, action) => {
        addPending(state, action.meta.arg)
        state.mutationError = null
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        removePending(state, action.payload)
        state.items = state.items.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        removePending(state, action.meta.arg)
        state.mutationError = action.payload ?? action.error.message
      })
  },
})

export const { clearMutationError } = todosSlice.actions
export default todosSlice.reducer
