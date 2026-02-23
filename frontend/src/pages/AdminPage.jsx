import React, { useState, useEffect } from 'react'
import { orderApi, restaurantApi } from '../services/api'
import { Users, Package, Store, TrendingUp, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [ordersRes, restaurantsRes] = await Promise.all([
        orderApi.getAll(),
        restaurantApi.getAll()
      ])
      setOrders(ordersRes.data)
      setRestaurants(restaurantsRes.data)
    } catch { toast.error('Failed to load admin data') }
    finally { setLoading(false) }
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status)
      toast.success('Status updated')
      loadData()
    } catch { toast.error('Failed') }
  }

  const filteredOrders = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus)
  const revenue = orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0)

  if (loading) return <div className="p-8 text-center text-stone-400">Loading admin panel...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-900">Admin Panel</h1>
        <button onClick={loadData} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <Package className="w-8 h-8 text-primary-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">{orders.length}</p>
          <p className="text-stone-500 text-sm">Total Orders</p>
        </div>
        <div className="card p-5">
          <Store className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">{restaurants.length}</p>
          <p className="text-stone-500 text-sm">Restaurants</p>
        </div>
        <div className="card p-5">
          <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">₹{revenue.toFixed(0)}</p>
          <p className="text-stone-500 text-sm">Total Revenue</p>
        </div>
        <div className="card p-5">
          <Users className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-stone-900">{orders.filter(o => o.status === 'PENDING').length}</p>
          <p className="text-stone-500 text-sm">Pending Orders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-xl mb-6 w-fit">
        {['orders', 'restaurants'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div>
          {/* Status filter */}
          <div className="flex gap-2 flex-wrap mb-5">
            {['ALL', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterStatus === s ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div key={order.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-900">Order #{order.id}</span>
                    <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status.replace('_', ' ')}</span>
                  </div>
                  <span className="text-stone-500 text-xs">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-stone-600 mb-3">
                  <span>👤 {order.customerName}</span>
                  <span>🏪 {order.restaurantName}</span>
                  <span>💰 ₹{order.totalAmount?.toFixed(0)}</span>
                  <span>📍 {order.deliveryAddress?.substring(0, 25)}...</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {STATUSES.filter(s => s !== order.status && s !== 'CANCELLED').map(s => (
                    <button key={s} onClick={() => handleStatusUpdate(order.id, s)}
                      className={`text-xs px-2 py-1 rounded-lg font-medium border transition-colors ${STATUS_COLORS[s]} border-current/20 hover:opacity-80`}>
                      → {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-stone-400">No orders with this status</div>
          )}
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="space-y-3">
          {restaurants.map(r => (
            <div key={r.id} className="card p-4 flex items-center gap-4">
              <img src={r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'} alt={r.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900">{r.name}</span>
                  <span className={`badge ${r.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.open ? 'Open' : 'Closed'}</span>
                </div>
                <p className="text-stone-500 text-sm">{r.cuisine} • ⭐ {r.rating} ({r.reviewCount} reviews)</p>
                <p className="text-stone-400 text-xs">{r.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-stone-700">₹{r.deliveryFee} delivery</p>
                <p className="text-xs text-stone-400">{r.deliveryTime} min</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
