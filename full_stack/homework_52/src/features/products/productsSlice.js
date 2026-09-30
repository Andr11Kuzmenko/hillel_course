import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { MOCK_PRODUCTS } from '../../data/mockProducts.js'

const API_URL = 'https://fakestoreapi.com/products'

const productsAdapter = createEntityAdapter()

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue, signal }) => {
    try {
      const timeout = AbortSignal.timeout?.(8000)
      const combined = timeout && AbortSignal.any ? AbortSignal.any([signal, timeout]) : signal
      const response = await fetch(API_URL, { signal: combined })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) throw new Error('Порожня відповідь сервера')
      return data
    } catch (err) {
      return rejectWithValue(err.message || 'Мережева помилка')
    }
  },
  {
    // не робимо повторний запит, якщо товари вже завантажені/завантажуються
    condition: (_, { getState }) => {
      const { status } = getState().products
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

const initialState = productsAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isFallback: false,
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isFallback = false
        productsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        // При помилці API показуємо резервні (mock) дані, щоб магазин залишався робочим
        state.status = 'succeeded'
        state.isFallback = true
        state.error = action.payload ?? action.error.message
        productsAdapter.setAll(state, MOCK_PRODUCTS)
      })
  },
})

export default productsSlice.reducer

// ---------- Selectors ----------
export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectTotal: selectProductsCount,
} = productsAdapter.getSelectors((state) => state.products)

export const selectProductsStatus = (state) => state.products.status
export const selectProductsError = (state) => state.products.error
export const selectIsFallback = (state) => state.products.isFallback

export const selectCategories = createSelector([selectAllProducts], (products) =>
  [...new Set(products.map((p) => p.category))].sort(),
)

export const selectPriceBounds = createSelector([selectAllProducts], (products) => {
  if (!products.length) return { min: 0, max: 0 }
  const prices = products.map((p) => p.price)
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
})

const selectFilters = (state) => state.filters

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0),
  title: (a, b) => a.title.localeCompare(b.title),
}

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters],
  (products, { search, category, sortBy, maxPrice }) => {
    const q = search.trim().toLowerCase()
    const result = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (maxPrice == null || p.price <= maxPrice) &&
        (!q || p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)),
    )
    return SORTERS[sortBy] ? [...result].sort(SORTERS[sortBy]) : result
  },
)

export const selectRelatedProducts = createSelector(
  [selectAllProducts, (state, product) => product],
  (products, product) =>
    product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [],
)
