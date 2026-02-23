import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { restaurantApi, orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { TrendingUp, Package, Store, ChevronRight, Clock, CheckCircle, ChefHat, Bike } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const NEXT_STATUS = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
}

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await restaurantApi.getMy()
      setRestaurants(res.data)
      if (res.data.length > 0) {
        setSelectedRestaurant(res.data[0])
        loadOrders(res.data[0].id)
      }
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async (restaurantId) => {
    try {
      const res = await orderApi.getRestaurantOrders(restaurantId)
      setAllOrders(res.data)
    } catch {}
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status)
      toast.success('Order status updated')
      loadOrders(selectedRestaurant.id)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleRestaurantToggle = async (id) => {
    try {
      await restaurantApi.toggle(id)
      toast.success('Restaurant status updated')
      loadData()
    } catch {
      toast.error('Failed to toggle')
    }
  }

  const activeOrders = allOrders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status))
  const revenue = allOrders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.totalAmount, 0)

  if (loading) return <div className="p-8 text-center text-stone-400">Loading dashboard...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Owner Dashboard</h1>
          <p className="text-stone-500">Welcome, {user?.name}</p>
        </div>
        <Link to="/owner/restaurants" className="btn-primary flex items-center gap-2">
          <Store className="w-4 h-4" />
          Manage Restaurants
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <Store className="w-8 h-8 text-primary-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">{restaurants.length}</p>
          <p className="text-stone-500 text-sm">Restaurants</p>
        </div>
        <div className="card p-5">
          <Package className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">{allOrders.length}</p>
          <p className="text-stone-500 text-sm">Total Orders</p>
        </div>
        <div className="card p-5">
          <Clock className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">{activeOrders.length}</p>
          <p className="text-stone-500 text-sm">Active Orders</p>
        </div>
        <div className="card p-5">
          <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">₹{revenue.toFixed(0)}</p>
          <p className="text-stone-500 text-sm">Revenue</p>
        </div>
      </div>

      {/* Restaurant selector */}
      {restaurants.length > 1 && (
        <div className="flex gap-2 mb-6">
          {restaurants.map(r => (
            <button
              key={r.id}
              onClick={() => { setSelectedRestaurant(r); loadOrders(r.id); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedRestaurant?.id === r.id ? 'bg-primary-500 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Active Orders */}
      <div>
        <h2 className="font-semibold text-stone-900 text-lg mb-4">Active Orders</h2>
        {activeOrders.length === 0 ? (
          <div className="card p-8 text-center text-stone-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
            No active orders
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map(order => (
              <div key={order.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-stone-900">Order #{order.id}</span>
                    <span className="text-stone-500 text-sm ml-2">by {order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    {NEXT_STATUS[order.status] && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, NEXT_STATUS[order.status])}
                        className="btn-primary py-1 px-3 text-xs"
                      >
                        Mark as {NEXT_STATUS[order.status].replace('_', ' ')}
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-stone-600">
                  {order.orderItems?.map(i => `${i.menuItemName} x${i.quantity}`).join(', ')}
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-stone-400">📍 {order.deliveryAddress}</span>
                  <span className="font-semibold text-stone-900">₹{order.totalAmount?.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
