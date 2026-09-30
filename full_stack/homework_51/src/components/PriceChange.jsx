import PropTypes from 'prop-types'
import { formatPercent } from '../utils/format.js'

function PriceChange({ value }) {
  if (value == null) return <span className="muted">—</span>
  return <span className={value >= 0 ? 'up' : 'down'}>{formatPercent(value)}</span>
}

PriceChange.propTypes = { value: PropTypes.number }

export default PriceChange
