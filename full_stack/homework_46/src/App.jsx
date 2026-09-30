import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchTodos } from './store/todosSlice.js'
import TodoForm from './components/TodoForm.jsx'
import FilterBar from './components/FilterBar.jsx'
import TodoList from './components/TodoList.jsx'
import TodoStats from './components/TodoStats.jsx'
import ErrorBanner from './components/ErrorBanner.jsx'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  return (
    <div className="app">
      <h1>Todo + createAsyncThunk</h1>
      <p className="subtitle">Дані з jsonplaceholder.typicode.com</p>
      <TodoForm />
      <ErrorBanner />
      <FilterBar />
      <TodoList />
      <TodoStats />
    </div>
  )
}
