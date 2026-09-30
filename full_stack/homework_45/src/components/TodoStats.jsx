import { useDispatch, useSelector } from 'react-redux'
import { clearCompleted, toggleAll } from '../store/todosSlice.js'
import { selectStats } from '../store/selectors.js'

export default function TodoStats() {
  const dispatch = useDispatch()
  const { total, completed, active } = useSelector(selectStats)

  return (
    <footer className="stats">
      <span>
        Усього: {total} · Активних: {active} · Виконаних: {completed}
      </span>
      <div>
        <button type="button" onClick={() => dispatch(toggleAll())} disabled={total === 0}>
          Позначити всі
        </button>
        <button type="button" onClick={() => dispatch(clearCompleted())} disabled={completed === 0}>
          Очистити виконані
        </button>
      </div>
    </footer>
  )
}
