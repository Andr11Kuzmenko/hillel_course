import PropTypes from 'prop-types'

/** Stateless-компонент: показує статистику, обчислену з отриманих props. */
function TaskStats({ total, done }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="stats">
      <p>
        Виконано <strong>{done}</strong> з <strong>{total}</strong> ({percent}%)
      </p>
      <div className="stats__bar">
        <div className="stats__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

TaskStats.propTypes = {
  total: PropTypes.number.isRequired,
  done: PropTypes.number.isRequired,
}

export default TaskStats
