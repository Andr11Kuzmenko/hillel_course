import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../store/todosSlice.js'

export default function TodoForm() {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    dispatch(addTodo(value))
    setTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Що потрібно зробити?"
        aria-label="Нове завдання"
      />
      <button type="submit" disabled={!title.trim()}>
        Додати
      </button>
    </form>
  )
}
