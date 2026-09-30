import { useDispatch, useSelector } from 'react-redux'
import { clearMutationError } from '../store/todosSlice.js'

export default function ErrorBanner() {
  const dispatch = useDispatch()
  const error = useSelector((state) => state.todos.mutationError)

  if (!error) return null

  return (
    <div className="alert alert--error" role="alert">
      <span>Не вдалося виконати операцію: {error}</span>
      <button type="button" onClick={() => dispatch(clearMutationError())} aria-label="Закрити">
        ✕
      </button>
    </div>
  )
}
