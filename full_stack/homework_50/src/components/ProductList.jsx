import { memo } from 'react'
import PropTypes from 'prop-types'
import ProductItem from './ProductItem.jsx'
import { useRenderCount } from '../hooks/useRenderCount.js'
import RenderBadge from './RenderBadge.jsx'

function ProductList({ products, total, favorites, selectedId, onToggleFavorite, onSelect, onShowMore }) {
  const renders = useRenderCount('ProductList', true)

  return (
    <section className="panel list">
      <header className="panel-header">
        <h2>
          Товари <small>({products.length} з {total})</small>
        </h2>
        <RenderBadge count={renders} />
      </header>
      {products.length === 0 ? (
        <p className="empty">Нічого не знайдено</p>
      ) : (
        <ul>
          {products.map((p) => (
            <ProductItem
              key={p.id}
              product={p}
              isFavorite={favorites.has(p.id)}
              isSelected={p.id === selectedId}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
      {products.length < total && (
        <button type="button" className="more" onClick={onShowMore}>
          Показати ще
        </button>
      )}
    </section>
  )
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  total: PropTypes.number.isRequired,
  favorites: PropTypes.instanceOf(Set).isRequired,
  selectedId: PropTypes.number,
  onToggleFavorite: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onShowMore: PropTypes.func.isRequired,
}

export default memo(ProductList)
