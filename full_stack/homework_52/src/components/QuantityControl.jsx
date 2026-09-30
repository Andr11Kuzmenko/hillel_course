import PropTypes from 'prop-types'
import { MAX_QUANTITY } from '../features/cart/cartSlice.js'

function QuantityControl({ value, onDecrement, onIncrement, onChange }) {
  return (
    <div className="qty">
      <button type="button" onClick={onDecrement} aria-label="Зменшити">
        −
      </button>
      <input
        type="number"
        min="1"
        max={MAX_QUANTITY}
        value={value}
        aria-label="Кількість"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button type="button" onClick={onIncrement} disabled={value >= MAX_QUANTITY} aria-label="Збільшити">
        +
      </button>
    </div>
  )
}

QuantityControl.propTypes = {
  value: PropTypes.number.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default QuantityControl
