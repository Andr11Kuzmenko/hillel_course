import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearOrders, selectOrders } from '../features/orders/ordersSlice.js'
import { formatPrice } from '../utils/format.js'

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' })

function OrdersPage() {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)

  if (orders.length === 0) {
    return (
      <section className="empty">
        <h1>Замовлень ще немає</h1>
        <Link to="/" className="btn primary">
          До каталогу
        </Link>
      </section>
    )
  }

  return (
    <>
      <div className="page-head">
        <h1>Мої замовлення</h1>
        <button type="button" className="btn ghost" onClick={() => dispatch(clearOrders())}>
          Очистити історію
        </button>
      </div>
      <ul className="orders">
        {orders.map((o) => (
          <li key={o.id} className="order">
            <div className="order-head">
              <strong>{o.id}</strong>
              <span className="muted">{dateFormat.format(new Date(o.createdAt))}</span>
              <strong>{formatPrice(o.totals.total)}</strong>
            </div>
            <ul className="order-items">
              {o.items.map((i) => (
                <li key={i.id}>
                  {i.title} × {i.quantity} — {formatPrice(i.price * i.quantity)}
                </li>
              ))}
            </ul>
            <span className="muted small">
              {o.customer.fullName}, {o.customer.city} · {o.customer.payment === 'card' ? `картка •••• ${o.customer.cardLast4}` : 'оплата при отриманні'}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default OrdersPage
