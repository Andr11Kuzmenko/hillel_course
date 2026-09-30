import PropTypes from 'prop-types'

/**
 * Stateless-компонент: не має власного стану, лише відображає отримані props
 * і викликає передані з батьківського компонента обробники.
 */
function TaskItem({ id, title, done = false, onToggle, onRemove }) {
  return (
    <li className={`task-item ${done ? 'task-item--done' : ''}`}>
      <label className="task-item__label">
        <input type="checkbox" checked={done} onChange={() => onToggle(id)} />
        <span>{title}</span>
      </label>
      <button className="task-item__remove" type="button" onClick={() => onRemove(id)} aria-label="Видалити">
        ✕
      </button>
    </li>
  )
}

TaskItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  done: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default TaskItem
