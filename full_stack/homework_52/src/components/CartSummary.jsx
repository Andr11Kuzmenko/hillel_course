import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { selectCartCount, selectCartTotals } from '../features/cart/cartSlice.js'
import { formatPrice } from '../utils/format.js'

function CartSummary({ children }) {
  const count = useSelector(selectCartCount)
  const { subtotal, shipping, total } = useSelector(selectCartTotals)

  return (
    <div className="summary">
      <h2>Разом</h2>
      <dl>
        <div>
          <dt>Товарів</dt>
          <dd>{count} шт.</dd>
        </div>
        <div>
          <dt>Сума</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Доставка</dt>
          <dd>{shipping === 0 ? 'Безкоштовно' : formatPrice(shipping)}</dd>
        </div>
        <div className="total">
          <dt>До сплати</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}

CartSummary.propTypes = { children: PropTypes.node }

export default CartSummary
