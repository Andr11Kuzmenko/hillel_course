import { useDispatch, useSelector } from 'react-redux'
import { FILTERS, setSearch, setStatusFilter } from '../store/filterSlice.js'
import { selectFilter } from '../store/selectors.js'

export default function FilterBar() {
  const dispatch = useDispatch()
  const { status, search } = useSelector(selectFilter)

  return (
    <div className="filter-bar">
      <input
        type="search"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Пошук..."
        aria-label="Пошук"
      />
      <div className="filter-bar__buttons">
        {Object.entries(FILTERS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={status === key ? 'active' : ''}
            onClick={() => dispatch(setStatusFilter(key))}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
