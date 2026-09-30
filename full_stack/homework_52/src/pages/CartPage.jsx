import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCart,
  decrementQuantity,
  FREE_SHIPPING_FROM,
  incrementQuantity,
  removeFromCart,
  selectCartItems,
  selectCartTotals,
  setQuantity,
} from '../features/cart/cartSlice.js'
import ProductImage from '../components/ProductImage.jsx'
import QuantityControl from '../components/QuantityControl.jsx'
import CartSummary from '../components/CartSummary.jsx'
import { formatPrice } from '../utils/format.js'

function CartPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const { subtotal } = useSelector(selectCartTotals)

  if (items.length === 0) {
    return (
      <section className="empty">
        <h1>Кошик порожній</h1>
        <p>Додайте товари з каталогу.</p>
        <Link to="/" className="btn primary">
          До каталогу
        </Link>
      </section>
    )
  }

  const leftForFree = FREE_SHIPPING_FROM - subtotal

  return (
    <>
      <div className="page-head">
        <h1>Кошик</h1>
        <button type="button" className="btn ghost" onClick={() => dispatch(clearCart())}>
          Очистити кошик
        </button>
      </div>
      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <ProductImage src={item.image} alt={item.title} className="cart-item-img" />
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>{item.title}</Link>
                <span className="muted">{formatPrice(item.price)} / шт.</span>
              </div>
              <QuantityControl
                value={item.quantity}
                onDecrement={() => dispatch(decrementQuantity(item.id))}
                onIncrement={() => dispatch(incrementQuantity(item.id))}
                onChange={(quantity) => dispatch(setQuantity({ id: item.id, quantity }))}
              />
              <strong className="cart-item-total">{formatPrice(item.price * item.quantity)}</strong>
              <button
                type="button"
                className="btn icon"
                aria-label={`Видалити ${item.title}`}
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <aside>
          <CartSummary>
            {leftForFree > 0 && (
              <p className="hint">Додайте ще на {formatPrice(leftForFree)} для безкоштовної доставки</p>
            )}
            <Link to="/checkout" className="btn primary block">
              Оформити замовлення
            </Link>
          </CartSummary>
        </aside>
      </div>
    </>
  )
}

export default CartPage
