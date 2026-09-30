import { createSlice } from '@reduxjs/toolkit'

export const initialFiltersState = {
  search: '',
  category: 'all',
  sortBy: 'default', // 'default' | 'price-asc' | 'price-desc' | 'rating' | 'title'
  maxPrice: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFiltersState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload
    },
    setCategory(state, action) {
      state.category = action.payload
    },
    setSortBy(state, action) {
      state.sortBy = action.payload
    },
    setMaxPrice(state, action) {
      state.maxPrice = action.payload
    },
    resetFilters() {
      return initialFiltersState
    },
  },
})

export const { setSearch, setCategory, setSortBy, setMaxPrice, resetFilters } = filtersSlice.actions
export const selectFiltersState = (state) => state.filters
export const selectHasActiveFilters = (state) => {
  const f = state.filters
  return f.search !== '' || f.category !== 'all' || f.sortBy !== 'default' || f.maxPrice != null
}
export default filtersSlice.reducer
