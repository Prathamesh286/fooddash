import React, { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, XCircle, Bike, ChefHat, AlertCircle } from 'lucide-react'
import { orderApi } from '../services/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50', border: 'border-yellow-200' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600 bg-blue-50', border: 'border-blue-200' },
  PREPARING: { label: 'Preparing', icon: ChefHat, color: 'text-orange-600 bg-orange-50', border: 'border-orange-200' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: Bike, color: 'text-purple-600 bg-purple-50', border: 'border-purple-200' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50', border: 'border-green-200' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-50', border: 'border-red-200' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const res = await orderApi.getMy()
      setOrders(res.data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId) => {
    setCancelling(orderId)
    try {
      await orderApi.cancel(orderId)
      toast.success('Order cancelled')
      loadOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-center text-stone-400">Loading orders...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-stone-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-600">No orders yet</h3>
          <p className="text-stone-400 mt-1">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
            const StatusIcon = config.icon
            return (
              <div key={order.id} className={`card p-5 border ${config.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-stone-900">{order.restaurantName}</span>
                      <span className="text-stone-400 text-xs">#{order.id}</span>
                    </div>
                    <span className="text-stone-400 text-xs">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <span className={`badge flex items-center gap-1 ${config.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </span>
                </div>

                {/* Items */}
                <div className="bg-stone-50 rounded-xl p-3 mb-3">
                  {order.orderItems?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <span className="text-stone-700">{item.menuItemName} × {item.quantity}</span>
                      <span className="text-stone-600">₹{item.subtotal.toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-stone-500">
                    <span>Delivery: ₹{order.deliveryFee} • </span>
                    <span className="font-semibold text-stone-900">Total: ₹{order.totalAmount?.toFixed(0)}</span>
                  </div>

                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancelling === order.id}
                      className="text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {cancelling === order.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>

                {order.deliveryAddress && (
                  <div className="mt-2 text-xs text-stone-400">📍 {order.deliveryAddress}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
