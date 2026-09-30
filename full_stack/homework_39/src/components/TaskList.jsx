import { useState } from 'react'
import TaskItem from './TaskItem.jsx'
import TaskStats from './TaskStats.jsx'

const initialTasks = [
  { id: 1, title: 'Прочитати документацію React', done: true },
  { id: 2, title: 'Розібратися з useState', done: false },
  { id: 3, title: 'Зробити домашнє завдання', done: false },
]

/**
 * Stateful-компонент: зберігає список задач і текст нового поля у стані (useState)
 * та передає дані й обробники дочірнім stateless-компонентам через props.
 */
function TaskList() {
  const [tasks, setTasks] = useState(initialTasks)
  const [title, setTitle] = useState('')

  const addTask = (event) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks((prev) => [...prev, { id: Date.now(), title: trimmed, done: false }])
    setTitle('')
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.done))
  }

  const doneCount = tasks.filter((task) => task.done).length

  return (
    <section className="card">
      <h2>Список задач (Stateful)</h2>

      <form className="task-form" onSubmit={addTask}>
        <input
          className="input"
          type="text"
          placeholder="Нова задача..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button className="btn" type="submit" disabled={!title.trim()}>
          Додати
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="muted">Задач немає — додайте першу!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              done={task.done}
              onToggle={toggleTask}
              onRemove={removeTask}
            />
          ))}
        </ul>
      )}

      <TaskStats total={tasks.length} done={doneCount} />

      {doneCount > 0 && (
        <button className="btn btn--danger" type="button" onClick={clearCompleted}>
          Видалити виконані
        </button>
      )}
    </section>
  )
}

export default TaskList
