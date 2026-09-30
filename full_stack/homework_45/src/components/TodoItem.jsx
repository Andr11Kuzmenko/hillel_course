import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { editTodo, removeTodo, toggleTodo } from '../store/todosSlice.js'

export default function TodoItem({ todo }) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)

  const save = () => {
    const value = draft.trim()
    if (value && value !== todo.title) dispatch(editTodo({ id: todo.id, title: value }))
    else setDraft(todo.title)
    setIsEditing(false)
  }

  return (
    <li className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch(toggleTodo(todo.id))}
        aria-label="Виконано"
      />
      {isEditing ? (
        <input
          className="todo-item__edit"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') {
              setDraft(todo.title)
              setIsEditing(false)
            }
          }}
        />
      ) : (
        <span className="todo-item__title" onDoubleClick={() => setIsEditing(true)}>
          {todo.title}
        </span>
      )}
      <button type="button" onClick={() => setIsEditing(true)} title="Редагувати">
        ✎
      </button>
      <button
        type="button"
        className="danger"
        onClick={() => dispatch(removeTodo(todo.id))}
        title="Видалити"
      >
        ✕
      </button>
    </li>
  )
}
