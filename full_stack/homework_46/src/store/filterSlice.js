import { createSlice } from '@reduxjs/toolkit'

export const FILTERS = {
  all: 'Усі',
  active: 'Активні',
  completed: 'Виконані',
}

const filterSlice = createSlice({
  name: 'filter',
  initialState: { status: 'all', search: '' },
  reducers: {
    setStatusFilter(state, action) {
      state.status = action.payload
    },
    setSearch(state, action) {
      state.search = action.payload
    },
  },
})

export const { setStatusFilter, setSearch } = filterSlice.actions
export default filterSlice.reducer
