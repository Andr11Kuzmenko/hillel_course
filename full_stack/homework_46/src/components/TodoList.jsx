import { useDispatch, useSelector } from 'react-redux'
import { fetchTodos } from '../store/todosSlice.js'
import { selectTodosState, selectVisibleTodos } from '../store/selectors.js'
import TodoItem from './TodoItem.jsx'

export default function TodoList() {
  const dispatch = useDispatch()
  const { status, error } = useSelector(selectTodosState)
  const todos = useSelector(selectVisibleTodos)

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="loader" role="status">
        <span className="spinner" /> Завантаження завдань…
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="alert alert--error" role="alert">
        <span>Помилка завантаження: {error}</span>
        <button type="button" onClick={() => dispatch(fetchTodos())}>
          Спробувати ще раз
        </button>
      </div>
    )
  }

  if (todos.length === 0) {
    return <p className="empty">Завдань немає</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
