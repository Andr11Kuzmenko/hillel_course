import { useDispatch, useSelector } from 'react-redux'
import { fetchTodos } from '../store/todosSlice.js'
import { selectStats, selectTodosState } from '../store/selectors.js'

export default function TodoStats() {
  const dispatch = useDispatch()
  const { status } = useSelector(selectTodosState)
  const { total, completed, active } = useSelector(selectStats)

  return (
    <footer className="stats">
      <span>
        Усього: {total} · Активних: {active} · Виконаних: {completed}
      </span>
      <button type="button" onClick={() => dispatch(fetchTodos())} disabled={status === 'loading'}>
        ⟳ Перезавантажити
      </button>
    </footer>
  )
}
