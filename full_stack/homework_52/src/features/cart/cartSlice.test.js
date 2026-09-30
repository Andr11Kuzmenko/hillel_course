import { describe, expect, it } from 'vitest'
import reducer, {
  addToCart,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartCount,
  selectCartTotals,
  setQuantity,
  SHIPPING_COST,
} from './cartSlice.js'
import { placeOrder } from '../orders/ordersSlice.js'

const p1 = { id: 1, title: 'A', price: 10, image: '', category: 'x' }
const p2 = { id: 2, title: 'B', price: 60, image: '', category: 'y' }

describe('cartSlice', () => {
  it('додає новий товар і збільшує кількість існуючого', () => {
    let state = reducer(undefined, addToCart(p1))
    state = reducer(state, addToCart(p1, 2))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(3)
  })

  it('increment / decrement / видалення при 0', () => {
    let state = reducer(undefined, addToCart(p1))
    state = reducer(state, incrementQuantity(1))
    expect(state.items[0].quantity).toBe(2)
    state = reducer(state, decrementQuantity(1))
    state = reducer(state, decrementQuantity(1))
    expect(state.items).toHaveLength(0)
  })

  it('setQuantity обмежує значення 1..99', () => {
    let state = reducer(undefined, addToCart(p1))
    state = reducer(state, setQuantity({ id: 1, quantity: 500 }))
    expect(state.items[0].quantity).toBe(99)
    state = reducer(state, setQuantity({ id: 1, quantity: 0 }))
    expect(state.items[0].quantity).toBe(1)
  })

  it('removeFromCart та clearCart', () => {
    let state = reducer(undefined, addToCart(p1))
    state = reducer(state, addToCart(p2))
    state = reducer(state, removeFromCart(1))
    expect(state.items.map((i) => i.id)).toEqual([2])
    state = reducer(state, clearCart())
    expect(state.items).toEqual([])
  })

  it('очищується після успішного замовлення', () => {
    const state = reducer({ items: [{ ...p1, quantity: 1 }] }, { type: placeOrder.fulfilled.type, payload: {} })
    expect(state.items).toEqual([])
  })

  it('селектори рахують кількість, суму та доставку', () => {
    let cart = reducer(undefined, addToCart(p1, 3))
    expect(selectCartCount({ cart })).toBe(3)
    expect(selectCartTotals({ cart })).toEqual({ subtotal: 30, shipping: SHIPPING_COST, total: 39.99 })
    cart = reducer(cart, addToCart(p2))
    expect(selectCartTotals({ cart })).toEqual({ subtotal: 90, shipping: SHIPPING_COST, total: 99.99 })
    cart = reducer(cart, addToCart(p1))
    expect(selectCartTotals({ cart }).shipping).toBe(0)
  })
})
