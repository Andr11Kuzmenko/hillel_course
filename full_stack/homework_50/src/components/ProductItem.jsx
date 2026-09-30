import { memo } from 'react'
import PropTypes from 'prop-types'
import { useRenderCount } from '../hooks/useRenderCount.js'

// memo: елемент списку перерендерюється лише якщо змінився САМЕ ВІН
// (product, isFavorite або isSelected). Завдяки useCallback у батьківському
// компоненті onToggleFavorite / onSelect мають стабільні посилання.
function ProductItem({ product, isFavorite, isSelected, onToggleFavorite, onSelect }) {
  const renders = useRenderCount(`ProductItem #${product.id}`)

  return (
    <li className={`product ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(product.id)}>
      <div className="product-main">
        <span className="product-title">{product.title}</span>
        <span className="product-meta">
          {product.category} · ★ {product.rating} · score {product.score}
        </span>
      </div>
      <span className="product-price">{product.price.toFixed(2)} ₴</span>
      <button
        type="button"
        className={`fav ${isFavorite ? 'on' : ''}`}
        aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(product.id)
        }}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <span className="item-renders" title="Рендерів цього елемента">
        {renders}
      </span>
    </li>
  )
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    score: PropTypes.number,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default memo(ProductItem)
