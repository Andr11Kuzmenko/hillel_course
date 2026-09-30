import PropTypes from 'prop-types'

function Rating({ rate = 0, count }) {
  const full = Math.round(rate)
  return (
    <span className="rating" title={`${rate} / 5`}>
      <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
      <span className="muted">
        {rate.toFixed(1)}
        {count != null && ` (${count})`}
      </span>
    </span>
  )
}

Rating.propTypes = { rate: PropTypes.number, count: PropTypes.number }

export default Rating
