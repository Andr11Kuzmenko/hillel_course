import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectProductById,
  selectProductsStatus,
  selectRelatedProducts,
} from '../features/products/productsSlice.js'
import { addToCart, MAX_QUANTITY, selectCartItemQuantity } from '../features/cart/cartSlice.js'
import ProductImage from '../components/ProductImage.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Rating from '../components/Rating.jsx'
import Loader from '../components/Loader.jsx'
import QuantityControl from '../components/QuantityControl.jsx'
import { formatPrice } from '../utils/format.js'

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const status = useSelector(selectProductsStatus)
  const product = useSelector((state) => selectProductById(state, Number(id)))
  const related = useSelector((state) => selectRelatedProducts(state, product))
  const inCart = useSelector((state) => selectCartItemQuantity(state, Number(id)))
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (status === 'idle' || status === 'loading') return <Loader />

  if (!product) {
    return (
      <section className="empty">
        <h2>Товар не знайдено</h2>
        <Link to="/">← Повернутися до каталогу</Link>
      </section>
    )
  }

  const clamp = (n) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(n) || 1))

  const handleAdd = () => {
    dispatch(addToCart(product, quantity))
    setAdded(true)
    setQuantity(1)
  }

  return (
    <>
      <button type="button" className="btn link" onClick={() => navigate(-1)}>
        ← Назад
      </button>
      <section className="product-details">
        <div className="product-details-img">
          <ProductImage src={product.image} alt={product.title} />
        </div>
        <div className="product-details-info">
          <span className="category">{product.category}</span>
          <h1>{product.title}</h1>
          <Rating rate={product.rating?.rate} count={product.rating?.count} />
          <p className="price big">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>
          <div className="buy-row">
            <QuantityControl
              value={quantity}
              onDecrement={() => setQuantity((q) => clamp(q - 1))}
              onIncrement={() => setQuantity((q) => clamp(q + 1))}
              onChange={(v) => setQuantity(clamp(v))}
            />
            <button type="button" className="btn primary" onClick={handleAdd}>
              Додати в кошик
            </button>
          </div>
          {(added || inCart > 0) && (
            <p className="success">
              У кошику: {inCart} шт. <Link to="/cart">Перейти до кошика →</Link>
            </p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <h2>Схожі товари</h2>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default ProductPage
