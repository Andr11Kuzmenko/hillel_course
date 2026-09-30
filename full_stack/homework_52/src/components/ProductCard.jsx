import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, selectCartItemQuantity } from '../features/cart/cartSlice.js'
import { formatPrice } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'
import Rating from './Rating.jsx'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const inCart = useSelector((state) => selectCartItemQuantity(state, product.id))

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-img">
        <ProductImage src={product.image} alt={product.title} />
      </Link>
      <div className="product-card-body">
        <span className="category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-card-title">
          {product.title}
        </Link>
        <Rating rate={product.rating?.rate} count={product.rating?.count} />
        <div className="product-card-footer">
          <strong className="price">{formatPrice(product.price)}</strong>
          <button type="button" className="btn primary" onClick={() => dispatch(addToCart(product))}>
            {inCart ? `У кошику (${inCart}) +` : 'В кошик'}
          </button>
        </div>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    category: PropTypes.string,
    rating: PropTypes.shape({ rate: PropTypes.number, count: PropTypes.number }),
  }).isRequired,
}

export default memo(ProductCard)
