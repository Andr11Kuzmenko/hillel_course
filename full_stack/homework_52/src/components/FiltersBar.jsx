import { useDispatch, useSelector } from 'react-redux'
import {
  resetFilters,
  selectFiltersState,
  selectHasActiveFilters,
  setCategory,
  setMaxPrice,
  setSearch,
  setSortBy,
} from '../features/filters/filtersSlice.js'
import { selectCategories, selectPriceBounds } from '../features/products/productsSlice.js'
import { formatPrice } from '../utils/format.js'

function FiltersBar() {
  const dispatch = useDispatch()
  const { search, category, sortBy, maxPrice } = useSelector(selectFiltersState)
  const categories = useSelector(selectCategories)
  const bounds = useSelector(selectPriceBounds)
  const hasActive = useSelector(selectHasActiveFilters)

  const priceValue = maxPrice ?? bounds.max

  return (
    <section className="filters">
      <input
        type="search"
        className="search"
        placeholder="Пошук товарів..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />
      <select value={category} onChange={(e) => dispatch(setCategory(e.target.value))} aria-label="Категорія">
        <option value="all">Усі категорії</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))} aria-label="Сортування">
        <option value="default">За замовчуванням</option>
        <option value="price-asc">Ціна: від дешевих</option>
        <option value="price-desc">Ціна: від дорогих</option>
        <option value="rating">За рейтингом</option>
        <option value="title">За назвою</option>
      </select>
      <label className="price-range">
        <span>до {formatPrice(priceValue)}</span>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          value={priceValue}
          onChange={(e) => {
            const v = Number(e.target.value)
            dispatch(setMaxPrice(v >= bounds.max ? null : v))
          }}
        />
      </label>
      {hasActive && (
        <button type="button" className="btn ghost" onClick={() => dispatch(resetFilters())}>
          Скинути
        </button>
      )}
    </section>
  )
}

export default FiltersBar
