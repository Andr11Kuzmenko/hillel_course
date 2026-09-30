import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// Імітація відправки замовлення на сервер
export const placeOrder = createAsyncThunk('orders/placeOrder', async ({ customer, items, totals }) => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer,
    items,
    totals,
  }
})

const initialState = {
  list: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastOrderId: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders(state) {
      state.list = []
      state.lastOrderId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list.unshift(action.payload)
        state.lastOrderId = action.payload.id
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { clearOrders } = ordersSlice.actions
export const selectOrders = (state) => state.orders.list
export const selectOrderStatus = (state) => state.orders.status
export const selectOrderById = (state, id) => state.orders.list.find((o) => o.id === id)
export default ordersSlice.reducer
