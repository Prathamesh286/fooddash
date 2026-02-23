import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [restaurantId, setRestaurantId] = useState(null)
  const [restaurantName, setRestaurantName] = useState('')

  const addToCart = (item, resId, resName) => {
    if (restaurantId && restaurantId !== resId) {
      const confirmed = window.confirm('Your cart has items from another restaurant. Clear cart and add new item?')
      if (!confirmed) return
      setCart([])
    }

    setRestaurantId(resId)
    setRestaurantName(resName)

    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const updated = prev.map(c => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c).filter(c => c.quantity > 0)
      if (updated.length === 0) {
        setRestaurantId(null)
        setRestaurantName('')
      }
      return updated
    })
  }

  const clearCart = () => {
    setCart([])
    setRestaurantId(null)
    setRestaurantName('')
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, restaurantId, restaurantName, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
