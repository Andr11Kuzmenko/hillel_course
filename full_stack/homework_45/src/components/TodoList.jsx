import { useSelector } from 'react-redux'
import { selectVisibleTodos } from '../store/selectors.js'
import TodoItem from './TodoItem.jsx'

export default function TodoList() {
  const todos = useSelector(selectVisibleTodos)

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
