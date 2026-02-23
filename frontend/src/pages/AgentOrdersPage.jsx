import React, { useState, useEffect } from 'react'
import { orderApi } from '../services/api'
import { Bike, MapPin, Package } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
}

export default function AgentOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try {
      const res = await orderApi.getAgentOrders()
      setOrders(res.data)
    } catch {
      // If no assigned orders, try showing all ready-to-deliver orders
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleDeliver = async (orderId) => {
    try {
      await orderApi.updateStatus(orderId, 'DELIVERED')
      toast.success('Order marked as delivered! 🎉')
      loadOrders()
    } catch {
      toast.error('Failed to update')
    }
  }

  const activeOrders = orders.filter(o => o.status === 'OUT_FOR_DELIVERY')
  const completedOrders = orders.filter(o => o.status === 'DELIVERED')

  if (loading) return <div className="p-8 text-center text-stone-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Bike className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">My Deliveries</h1>
          <p className="text-stone-500 text-sm">{activeOrders.length} active • {completedOrders.length} completed</p>
        </div>
      </div>

      {activeOrders.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-stone-900 mb-3">Active Deliveries</h2>
          <div className="space-y-3">
            {activeOrders.map(order => (
              <div key={order.id} className="card p-5 border-2 border-purple-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-stone-900">Order #{order.id}</p>
                    <p className="text-stone-500 text-sm">{order.restaurantName}</p>
                  </div>
                  <span className="badge bg-purple-100 text-purple-700">Out for Delivery</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-stone-600 mb-4">
                  <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <span>{order.deliveryAddress}</span>
                </div>
                <div className="text-sm text-stone-700 mb-4">
                  {order.orderItems?.map(i => `${i.menuItemName} x${i.quantity}`).join(', ')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">₹{order.totalAmount?.toFixed(0)}</span>
                  <button onClick={() => handleDeliver(order.id)} className="btn-primary py-1.5 px-4 text-sm">
                    Mark Delivered ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedOrders.length > 0 && (
        <div>
          <h2 className="font-semibold text-stone-900 mb-3">Completed</h2>
          <div className="space-y-2">
            {completedOrders.slice(0, 10).map(order => (
              <div key={order.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-800 text-sm">Order #{order.id} — {order.restaurantName}</p>
                  <p className="text-stone-400 text-xs">{new Date(order.updatedAt || order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="badge bg-green-100 text-green-700 text-xs">Delivered</span>
                  <p className="text-stone-600 font-semibold text-sm mt-1">₹{order.totalAmount?.toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-semibold text-stone-600">No deliveries yet</h3>
          <p className="text-stone-400 text-sm mt-1">Orders assigned to you will appear here</p>
        </div>
      )}
    </div>
  )
}
