import { afterEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import productsReducer, {
  fetchProducts,
  selectAllProducts,
  selectCategories,
  selectFilteredProducts,
  selectIsFallback,
} from './productsSlice.js'
import filtersReducer, { setCategory, setSearch, setSortBy } from '../filters/filtersSlice.js'
import { MOCK_PRODUCTS } from '../../data/mockProducts.js'

const makeStore = () => configureStore({ reducer: { products: productsReducer, filters: filtersReducer } })

const apiProducts = [
  { id: 1, title: 'Red shirt', price: 20, category: 'clothes', description: '', rating: { rate: 4 } },
  { id: 2, title: 'Blue phone', price: 300, category: 'electronics', description: '', rating: { rate: 4.8 } },
  { id: 3, title: 'Green shirt', price: 15, category: 'clothes', description: '', rating: { rate: 3 } },
]

afterEach(() => vi.unstubAllGlobals())

describe('productsSlice', () => {
  it('завантажує товари з API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(apiProducts) }))
    const store = makeStore()
    await store.dispatch(fetchProducts())
    const state = store.getState()
    expect(selectAllProducts(state)).toHaveLength(3)
    expect(selectIsFallback(state)).toBe(false)
    expect(selectCategories(state)).toEqual(['clothes', 'electronics'])
  })

  it('використовує mock-дані при помилці API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const store = makeStore()
    await store.dispatch(fetchProducts())
    const state = store.getState()
    expect(selectIsFallback(state)).toBe(true)
    expect(state.products.error).toBe('offline')
    expect(selectAllProducts(state)).toHaveLength(MOCK_PRODUCTS.length)
  })

  it('фільтрує та сортує через createSelector', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(apiProducts) }))
    const store = makeStore()
    await store.dispatch(fetchProducts())
    store.dispatch(setCategory('clothes'))
    store.dispatch(setSortBy('price-asc'))
    expect(selectFilteredProducts(store.getState()).map((p) => p.id)).toEqual([3, 1])
    store.dispatch(setSearch('red'))
    expect(selectFilteredProducts(store.getState()).map((p) => p.id)).toEqual([1])
    // мемоізація: той самий стан — той самий масив
    expect(selectFilteredProducts(store.getState())).toBe(selectFilteredProducts(store.getState()))
  })
})
