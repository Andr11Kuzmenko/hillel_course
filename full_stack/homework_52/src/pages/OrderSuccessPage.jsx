import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectOrderById } from '../features/orders/ordersSlice.js'
import { formatPrice } from '../utils/format.js'

function OrderSuccessPage() {
  const { orderId } = useParams()
  const order = useSelector((state) => selectOrderById(state, orderId))

  if (!order) {
    return (
      <section className="empty">
        <h1>Замовлення не знайдено</h1>
        <Link to="/">До каталогу</Link>
      </section>
    )
  }

  return (
    <section className="success-page">
      <div className="success-icon">✓</div>
      <h1>Дякуємо за замовлення!</h1>
      <p>
        Номер замовлення: <strong>{order.id}</strong>
      </p>
      <p className="muted">
        Підтвердження надіслано на {order.customer.email}. Сума: {formatPrice(order.totals.total)}
      </p>
      <div className="actions">
        <Link to="/" className="btn primary">
          Продовжити покупки
        </Link>
        <Link to="/orders" className="btn ghost">
          Мої замовлення
        </Link>
      </div>
    </section>
  )
}

export default OrderSuccessPage
