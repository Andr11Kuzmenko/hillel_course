import PropTypes from 'prop-types'

/** Stateless-компонент: просто відображає значення, отримане через props. */
function CounterDisplay({ value, label = 'Значення' }) {
  const color = value > 0 ? '#16a34a' : value < 0 ? '#dc2626' : '#374151'

  return (
    <div className="counter-display">
      <span className="muted">{label}</span>
      <span className="counter-display__value" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

CounterDisplay.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string,
}

export default CounterDisplay
