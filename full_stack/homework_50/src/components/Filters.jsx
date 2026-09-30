import { memo } from 'react'
import PropTypes from 'prop-types'
import { CATEGORIES } from '../utils/generateProducts.js'
import { useRenderCount } from '../hooks/useRenderCount.js'
import RenderBadge from './RenderBadge.jsx'

// memo: панель фільтрів перерендерюється лише коли змінюються її значення
// або (стабільні завдяки useCallback) обробники.
function Filters({ query, category, sortBy, onQueryChange, onCategoryChange, onSortChange, onReset }) {
  const renders = useRenderCount('Filters', true)

  return (
    <section className="panel filters">
      <header className="panel-header">
        <h2>Фільтри</h2>
        <RenderBadge count={renders} />
      </header>
      <div className="filters-row">
        <input
          type="search"
          placeholder="Пошук за назвою..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">Усі категорії</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="price-asc">Ціна ↑</option>
          <option value="price-desc">Ціна ↓</option>
          <option value="rating">Рейтинг</option>
          <option value="score">Score (дороге обчислення)</option>
          <option value="title">Назва</option>
        </select>
        <button type="button" onClick={onReset}>
          Скинути
        </button>
      </div>
    </section>
  )
}

Filters.propTypes = {
  query: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

export default memo(Filters)
