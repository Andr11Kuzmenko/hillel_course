import { useCallback, useMemo, useState } from 'react'
import Filters from './components/Filters.jsx'
import ProductList from './components/ProductList.jsx'
import Stats from './components/Stats.jsx'
import Counter from './components/Counter.jsx'
import RenderBadge from './components/RenderBadge.jsx'
import { generateProducts } from './utils/generateProducts.js'
import { computeStats, filterAndSortProducts } from './utils/expensive.js'
import { useRenderCount } from './hooks/useRenderCount.js'

const PRODUCTS_COUNT = 5000
const PAGE_SIZE = 200

const INITIAL_FILTERS = { query: '', category: 'all', sortBy: 'price-asc' }

function App() {
  const renders = useRenderCount('App', true)

  // Генерація 5000 товарів виконується один раз (lazy initializer useState).
  const [products] = useState(() => generateProducts(PRODUCTS_COUNT))
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [favorites, setFavorites] = useState(() => new Set())
  const [selectedId, setSelectedId] = useState(null)

  // Стан, НЕ пов'язаний зі списком
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState('light')

  // useMemo #1: дорога фільтрація + сортування + slowScore для кожного товару.
  // Перераховується тільки при зміні products або filters.
  const { filtered, computeTime } = useMemo(() => {
    const start = performance.now()
    const result = filterAndSortProducts(products, filters)
    const time = performance.now() - start
    console.log(`[useMemo] filterAndSortProducts: ${result.length} items, ${time.toFixed(1)} ms`)
    return { filtered: result, computeTime: time }
  }, [products, filters])

  // useMemo #2: агрегована статистика по відфільтрованих товарах.
  const stats = useMemo(() => computeStats(filtered), [filtered])

  // useMemo #3: зріз для відображення — стабільний масив, поки не змінились filtered/visibleCount.
  const visibleProducts = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  const selectedProduct = useMemo(
    () => (selectedId == null ? null : products.find((p) => p.id === selectedId)),
    [products, selectedId],
  )

  // useCallback: стабільні посилання на обробники, щоб memo-компоненти не
  // перерендерювались через "нову" функцію на кожен рендер App.
  const handleQueryChange = useCallback((query) => {
    setFilters((f) => ({ ...f, query }))
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleCategoryChange = useCallback((category) => {
    setFilters((f) => ({ ...f, category }))
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleSortChange = useCallback((sortBy) => {
    setFilters((f) => ({ ...f, sortBy }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS)
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleToggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSelect = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const handleShowMore = useCallback(() => {
    setVisibleCount((c) => c + PAGE_SIZE)
  }, [])

  const handleIncrement = useCallback(() => setCount((c) => c + 1), [])
  const handleToggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [])

  return (
    <div className={`app theme-${theme}`}>
      <header className="app-header">
        <h1>Мемоізація в React</h1>
        <p>
          {PRODUCTS_COUNT} згенерованих товарів · React.memo · useMemo · useCallback
        </p>
        <RenderBadge count={renders} />
      </header>

      <div className="layout">
        <aside>
          <Counter
            count={count}
            onIncrement={handleIncrement}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
          <Stats stats={stats} computeTime={computeTime} favoritesCount={favorites.size} />
          {selectedProduct && (
            <section className="panel">
              <h2>Вибраний товар</h2>
              <p>
                <strong>{selectedProduct.title}</strong>
              </p>
              <p>Категорія: {selectedProduct.category}</p>
              <p>Ціна: {selectedProduct.price.toFixed(2)} ₴</p>
              <p>На складі: {selectedProduct.stock}</p>
            </section>
          )}
        </aside>

        <main>
          <Filters
            query={filters.query}
            category={filters.category}
            sortBy={filters.sortBy}
            onQueryChange={handleQueryChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />
          <ProductList
            products={visibleProducts}
            total={filtered.length}
            favorites={favorites}
            selectedId={selectedId}
            onToggleFavorite={handleToggleFavorite}
            onSelect={handleSelect}
            onShowMore={handleShowMore}
          />
        </main>
      </div>
    </div>
  )
}

export default App
