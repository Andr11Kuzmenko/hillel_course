import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectCartTotals } from '../features/cart/cartSlice.js'
import { placeOrder, selectOrderStatus } from '../features/orders/ordersSlice.js'
import CartSummary from '../components/CartSummary.jsx'
import { EMPTY_CHECKOUT, formatCardNumber, formatExpiry, validateCheckout } from '../utils/validation.js'

function Field({ label, name, error, touched, children }) {
  return (
    <label className={`field ${touched && error ? 'invalid' : ''}`} htmlFor={name}>
      <span>{label}</span>
      {children}
      {touched && error && <span className="field-error">{error}</span>}
    </label>
  )
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const totals = useSelector(selectCartTotals)
  const orderStatus = useSelector(selectOrderStatus)

  const [values, setValues] = useState(EMPTY_CHECKOUT)
  const [touched, setTouched] = useState({})
  // true після відправки — щоб очищення кошика не спричинило редірект на /cart
  const [placed, setPlaced] = useState(false)
  const errors = validateCheckout(values)
  const submitting = orderStatus === 'loading'

  if (items.length === 0 && !submitting && !placed) return <Navigate to="/cart" replace />

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let next = type === 'checkbox' ? checked : value
    if (name === 'cardNumber') next = formatCardNumber(value)
    if (name === 'cardExpiry') next = formatExpiry(value)
    if (name === 'cardCvv') next = value.replace(/\D/g, '').slice(0, 3)
    setValues((v) => ({ ...v, [name]: next }))
  }

  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(Object.fromEntries(Object.keys(EMPTY_CHECKOUT).map((k) => [k, true])))
    if (Object.keys(errors).length > 0) return

    // eslint-disable-next-line no-unused-vars
    const { cardNumber, cardCvv, cardExpiry, agree, ...customer } = values
    setPlaced(true)
    try {
      const order = await dispatch(
        placeOrder({
          customer: { ...customer, cardLast4: values.payment === 'card' ? cardNumber.slice(-4) : null },
          items,
          totals,
        }),
      ).unwrap()
      navigate(`/order/${order.id}`, { replace: true })
    } catch {
      setPlaced(false)
    }
  }

  const common = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(touched[name] && errors[name]),
  })

  return (
    <>
      <div className="page-head">
        <h1>Оформлення замовлення</h1>
        <Link to="/cart">← Повернутися до кошика</Link>
      </div>
      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          {orderStatus === 'failed' && (
            <p className="banner" role="alert">
              Не вдалося оформити замовлення. Спробуйте ще раз.
            </p>
          )}
          <fieldset>
            <legend>Контактні дані</legend>
            <Field label="Ім'я та прізвище" name="fullName" error={errors.fullName} touched={touched.fullName}>
              <input {...common('fullName')} autoComplete="name" placeholder="Тарас Шевченко" />
            </Field>
            <div className="row-2">
              <Field label="Email" name="email" error={errors.email} touched={touched.email}>
                <input {...common('email')} type="email" autoComplete="email" placeholder="you@example.com" />
              </Field>
              <Field label="Телефон" name="phone" error={errors.phone} touched={touched.phone}>
                <input {...common('phone')} type="tel" autoComplete="tel" placeholder="+380501234567" />
              </Field>
            </div>
          </fieldset>

          <fieldset>
            <legend>Доставка</legend>
            <div className="row-2">
              <Field label="Місто" name="city" error={errors.city} touched={touched.city}>
                <input {...common('city')} autoComplete="address-level2" placeholder="Київ" />
              </Field>
              <Field label="Адреса / відділення" name="address" error={errors.address} touched={touched.address}>
                <input {...common('address')} autoComplete="street-address" placeholder="вул. Хрещатик, 1" />
              </Field>
            </div>
          </fieldset>

          <fieldset>
            <legend>Оплата</legend>
            <div className="radio-row">
              <label>
                <input type="radio" name="payment" value="cash" checked={values.payment === 'cash'} onChange={handleChange} />
                Під час отримання
              </label>
              <label>
                <input type="radio" name="payment" value="card" checked={values.payment === 'card'} onChange={handleChange} />
                Карткою онлайн
              </label>
            </div>
            {values.payment === 'card' && (
              <div className="row-3">
                <Field label="Номер картки" name="cardNumber" error={errors.cardNumber} touched={touched.cardNumber}>
                  <input {...common('cardNumber')} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
                </Field>
                <Field label="Термін дії" name="cardExpiry" error={errors.cardExpiry} touched={touched.cardExpiry}>
                  <input {...common('cardExpiry')} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" />
                </Field>
                <Field label="CVV" name="cardCvv" error={errors.cardCvv} touched={touched.cardCvv}>
                  <input {...common('cardCvv')} inputMode="numeric" autoComplete="cc-csc" placeholder="123" type="password" />
                </Field>
              </div>
            )}
          </fieldset>

          <Field label="Коментар до замовлення" name="comment" error={errors.comment} touched={touched.comment}>
            <textarea {...common('comment')} rows={3} placeholder="Необов'язково" />
          </Field>

          <label className={`checkbox ${touched.agree && errors.agree ? 'invalid' : ''}`}>
            <input type="checkbox" name="agree" checked={values.agree} onChange={handleChange} onBlur={handleBlur} />
            Погоджуюсь з умовами обробки персональних даних
          </label>
          {touched.agree && errors.agree && <span className="field-error">{errors.agree}</span>}

          <button type="submit" className="btn primary block" disabled={submitting}>
            {submitting ? 'Оформлюємо...' : 'Підтвердити замовлення'}
          </button>
        </form>
        <aside>
          <CartSummary />
        </aside>
      </div>
    </>
  )
}

export default CheckoutPage
