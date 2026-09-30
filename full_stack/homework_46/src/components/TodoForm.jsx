import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo } from '../store/todosSlice.js'

export default function TodoForm() {
  const dispatch = useDispatch()
  const adding = useSelector((state) => state.todos.adding)
  const [title, setTitle] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    // unwrap() повертає payload або кидає помилку — очищаємо поле лише при успіху
    try {
      await dispatch(addTodo(value)).unwrap()
      setTitle('')
    } catch {
      // помилку показує ErrorBanner
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Що потрібно зробити?"
        aria-label="Нове завдання"
        disabled={adding}
      />
      <button type="submit" disabled={!title.trim() || adding}>
        {adding ? 'Додаємо…' : 'Додати'}
      </button>
    </form>
  )
}
