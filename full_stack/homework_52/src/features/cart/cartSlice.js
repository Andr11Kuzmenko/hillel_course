import { createSelector, createSlice } from '@reduxjs/toolkit'
import { placeOrder } from '../orders/ordersSlice.js'

export const MAX_QUANTITY = 99
export const FREE_SHIPPING_FROM = 100
export const SHIPPING_COST = 9.99

const clamp = (n) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(n) || 1))

const initialState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: {
      reducer(state, action) {
        const { product, quantity } = action.payload
        const existing = state.items.find((i) => i.id === product.id)
        if (existing) {
          existing.quantity = clamp(existing.quantity + quantity)
        } else {
          const { id, title, price, image, category } = product
          state.items.push({ id, title, price, image, category, quantity: clamp(quantity) })
        }
      },
      prepare(product, quantity = 1) {
        return { payload: { product, quantity } }
      },
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    incrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.quantity = clamp(item.quantity + 1)
    },
    decrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (!item) return
      if (item.quantity <= 1) state.items = state.items.filter((i) => i.id !== action.payload)
      else item.quantity -= 1
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((i) => i.id === id)
      if (item) item.quantity = clamp(quantity)
    },
    clearCart(state) {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    // після успішного оформлення замовлення кошик очищується
    builder.addCase(placeOrder.fulfilled, (state) => {
      state.items = []
    })
  },
})

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, setQuantity, clearCart } =
  cartSlice.actions

export default cartSlice.reducer

// ---------- Selectors ----------
export const selectCartItems = (state) => state.cart.items

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0),
)

export const selectCartTotals = createSelector([selectCartItems], (items) => {
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
  return { subtotal, shipping, total: Math.round((subtotal + shipping) * 100) / 100 }
})

export const selectCartItemQuantity = (state, id) =>
  state.cart.items.find((i) => i.id === id)?.quantity ?? 0
