import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTodo, toggleTodo, updateTodoTitle } from '../store/todosSlice.js'
import { selectIsPending } from '../store/selectors.js'

export default function TodoItem({ todo }) {
  const dispatch = useDispatch()
  const isPending = useSelector(selectIsPending(todo.id))
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)

  const save = () => {
    const value = draft.trim()
    if (value && value !== todo.title) dispatch(updateTodoTitle({ id: todo.id, title: value }))
    else setDraft(todo.title)
    setIsEditing(false)
  }

  return (
    <li
      className={`todo-item ${todo.completed ? 'todo-item--done' : ''} ${isPending ? 'todo-item--pending' : ''}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        disabled={isPending}
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
        <span className="todo-item__title" onDoubleClick={() => !isPending && setIsEditing(true)}>
          {todo.title}
        </span>
      )}
      {isPending && <span className="spinner spinner--small" aria-label="Збереження" />}
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        disabled={isPending}
        title="Редагувати"
      >
        ✎
      </button>
      <button
        type="button"
        className="danger"
        onClick={() => dispatch(deleteTodo(todo.id))}
        disabled={isPending}
        title="Видалити"
      >
        ✕
      </button>
    </li>
  )
}
