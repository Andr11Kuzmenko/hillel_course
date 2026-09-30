import { useSelector } from 'react-redux'
import FiltersBar from '../components/FiltersBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Loader from '../components/Loader.jsx'
import {
  selectFilteredProducts,
  selectProductsCount,
  selectProductsStatus,
} from '../features/products/productsSlice.js'

function CatalogPage() {
  const status = useSelector(selectProductsStatus)
  const products = useSelector(selectFilteredProducts)
  const total = useSelector(selectProductsCount)

  if (status === 'idle' || status === 'loading') return <Loader />

  return (
    <>
      <div className="page-head">
        <h1>Каталог</h1>
        <span className="muted">
          Знайдено {products.length} з {total}
        </span>
      </div>
      <FiltersBar />
      {products.length === 0 ? (
        <p className="empty">За вашим запитом нічого не знайдено.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  )
}

export default CatalogPage
