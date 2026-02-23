import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../services/api'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, restaurantId, restaurantName, addToCart, removeFromCart, clearCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState(user?.address || '')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(false)

  const deliveryFee = 30
  const grandTotal = total + deliveryFee

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        restaurantId,
        items: cart.map(item => ({ menuItemId: item.id, quantity: item.quantity })),
        deliveryAddress: address,
        paymentMethod,
        specialInstructions: instructions,
      }
      const res = await orderApi.place(orderData)
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate(`/orders`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-stone-700 mb-2">Your cart is empty</h2>
        <p className="text-stone-400 mb-6">Add items from a restaurant to get started</p>
        <button onClick={() => navigate('/')} className="btn-primary">Browse Restaurants</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-stone-900 mb-2">Your Cart</h1>
      <p className="text-stone-500 text-sm mb-6">from <span className="font-semibold text-primary-600">{restaurantName}</span></p>

      {/* Cart items */}
      <div className="card p-4 mb-5 space-y-3">
        {cart.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
            )}
            <div className="flex-1">
              <p className="font-medium text-stone-900">{item.name}</p>
              <p className="text-primary-600 font-semibold">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2 bg-stone-50 rounded-xl p-1">
              <button
                onClick={() => removeFromCart(item.id)}
                className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
              >
                {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3 text-stone-700" />}
              </button>
              <span className="w-6 text-center font-bold text-stone-800 text-sm">{item.quantity}</span>
              <button
                onClick={() => addToCart(item, restaurantId, restaurantName)}
                className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center shadow-sm"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            </div>
            <span className="text-stone-700 font-semibold w-16 text-right">₹{(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
      </div>

      {/* Order details form */}
      <div className="card p-5 mb-5">
        <h3 className="font-semibold text-stone-900 mb-4">Delivery Details</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Delivery Address *</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Enter your delivery address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Payment Method</label>
            <div className="flex gap-3">
              {['CASH', 'CARD', 'UPI'].map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    paymentMethod === method
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Special Instructions</label>
            <input
              className="input"
              placeholder="Any special requests? (optional)"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bill summary */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-stone-900 mb-4">Bill Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-stone-900 text-base">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(0)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="btn-primary w-full text-center text-base py-3.5"
      >
        {loading ? 'Placing Order...' : `Place Order • ₹${grandTotal.toFixed(0)}`}
      </button>
    </div>
  )
}
