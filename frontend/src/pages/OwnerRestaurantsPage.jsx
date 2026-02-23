import React, { useState, useEffect } from 'react'
import { restaurantApi, menuApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Plus, Store, Edit, ToggleLeft, ToggleRight, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const RestaurantForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    name: '', description: '', address: '', phone: '', imageUrl: '', cuisine: '', openingHours: '',
    deliveryTime: 30, deliveryFee: 30, minOrderAmount: 100
  })

  return (
    <div className="card p-6 mb-6 border-2 border-primary-200">
      <h3 className="font-semibold text-stone-900 mb-4">{initial ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Name *</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Cuisine</label><input className="input" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} /></div>
        <div className="col-span-2"><label className="text-sm font-medium text-stone-700 block mb-1">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Address</label><input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
        <div className="col-span-2"><label className="text-sm font-medium text-stone-700 block mb-1">Image URL</label><input className="input" placeholder="https://..." value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} /></div>
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Opening Hours</label><input className="input" placeholder="10 AM - 10 PM" value={form.openingHours} onChange={e => setForm({...form, openingHours: e.target.value})} /></div>
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Delivery Time (min)</label><input type="number" className="input" value={form.deliveryTime} onChange={e => setForm({...form, deliveryTime: parseInt(e.target.value)})} /></div>
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Delivery Fee (₹)</label><input type="number" className="input" value={form.deliveryFee} onChange={e => setForm({...form, deliveryFee: parseFloat(e.target.value)})} /></div>
        <div><label className="text-sm font-medium text-stone-700 block mb-1">Min Order (₹)</label><input type="number" className="input" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: parseFloat(e.target.value)})} /></div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave(form)} className="btn-primary">Save Restaurant</button>
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </div>
  )
}

const MenuItemForm = ({ restaurantId, onAdded, onCancel }) => {
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '', category: '', vegetarian: false })

  const handleSave = async () => {
    try {
      await menuApi.add(restaurantId, { ...form, price: parseFloat(form.price) })
      toast.success('Menu item added!')
      onAdded()
    } catch {
      toast.error('Failed to add item')
    }
  }

  return (
    <div className="bg-stone-50 rounded-xl p-4 mt-3 border border-stone-200">
      <h4 className="font-medium text-stone-800 mb-3">Add Menu Item</h4>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-stone-600 block mb-1">Name</label><input className="input text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-xs font-medium text-stone-600 block mb-1">Price (₹)</label><input type="number" className="input text-sm" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
        <div><label className="text-xs font-medium text-stone-600 block mb-1">Category</label><input className="input text-sm" placeholder="Main Course" value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
        <div><label className="text-xs font-medium text-stone-600 block mb-1">Image URL</label><input className="input text-sm" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} /></div>
        <div className="col-span-2"><label className="text-xs font-medium text-stone-600 block mb-1">Description</label><input className="input text-sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" id="veg" checked={form.vegetarian} onChange={e => setForm({...form, vegetarian: e.target.checked})} className="rounded" />
          <label htmlFor="veg" className="text-sm text-stone-700">Vegetarian</label>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={handleSave} className="btn-primary py-1.5 text-sm">Add Item</button>
        <button onClick={onCancel} className="btn-secondary py-1.5 text-sm">Cancel</button>
      </div>
    </div>
  )
}

export default function OwnerRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [menus, setMenus] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState(null)
  const [expandedRestaurant, setExpandedRestaurant] = useState(null)
  const [showAddMenuForm, setShowAddMenuForm] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadRestaurants() }, [])

  const loadRestaurants = async () => {
    try {
      const res = await restaurantApi.getMy()
      setRestaurants(res.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const loadMenu = async (restaurantId) => {
    const res = await menuApi.getByRestaurant(restaurantId)
    setMenus(prev => ({ ...prev, [restaurantId]: res.data }))
  }

  const handleToggleExpand = (id) => {
    const newExpanded = expandedRestaurant === id ? null : id
    setExpandedRestaurant(newExpanded)
    if (newExpanded) loadMenu(newExpanded)
  }

  const handleSaveRestaurant = async (form) => {
    try {
      if (editingRestaurant) {
        await restaurantApi.update(editingRestaurant.id, form)
        toast.success('Restaurant updated!')
        setEditingRestaurant(null)
      } else {
        await restaurantApi.create(form)
        toast.success('Restaurant created!')
        setShowAddForm(false)
      }
      loadRestaurants()
    } catch { toast.error('Failed to save') }
  }

  const handleToggleStatus = async (id) => {
    try {
      await restaurantApi.toggle(id)
      toast.success('Status updated')
      loadRestaurants()
    } catch { toast.error('Failed') }
  }

  const handleToggleItem = async (itemId, restaurantId) => {
    try {
      await menuApi.toggle(itemId)
      loadMenu(restaurantId)
    } catch { toast.error('Failed') }
  }

  const handleDeleteItem = async (itemId, restaurantId) => {
    if (!confirm('Delete this item?')) return
    try {
      await menuApi.delete(itemId)
      toast.success('Item deleted')
      loadMenu(restaurantId)
    } catch { toast.error('Failed') }
  }

  if (loading) return <div className="p-8 text-center text-stone-400">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-900">My Restaurants</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Restaurant
        </button>
      </div>

      {showAddForm && (
        <RestaurantForm onSave={handleSaveRestaurant} onCancel={() => setShowAddForm(false)} />
      )}

      {editingRestaurant && (
        <RestaurantForm initial={editingRestaurant} onSave={handleSaveRestaurant} onCancel={() => setEditingRestaurant(null)} />
      )}

      <div className="space-y-4">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="card">
            <div className="p-5 flex items-center gap-4">
              <img
                src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'}
                alt={restaurant.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-stone-900">{restaurant.name}</h3>
                  <span className={`badge ${restaurant.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {restaurant.open ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="text-stone-500 text-sm">{restaurant.cuisine} • {restaurant.address}</p>
                <p className="text-stone-400 text-xs mt-0.5">⭐ {restaurant.rating} • {restaurant.reviewCount} reviews</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingRestaurant(restaurant)} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleToggleStatus(restaurant.id)} className={`p-2 rounded-lg transition-colors ${restaurant.open ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`} title="Toggle open/close">
                  {restaurant.open ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => handleToggleExpand(restaurant.id)} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg">
                  {expandedRestaurant === restaurant.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Menu section */}
            {expandedRestaurant === restaurant.id && (
              <div className="border-t border-stone-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-stone-800">Menu Items</h4>
                  <button onClick={() => setShowAddMenuForm(showAddMenuForm === restaurant.id ? null : restaurant.id)} className="text-sm text-primary-600 font-medium flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                {showAddMenuForm === restaurant.id && (
                  <MenuItemForm
                    restaurantId={restaurant.id}
                    onAdded={() => { loadMenu(restaurant.id); setShowAddMenuForm(null) }}
                    onCancel={() => setShowAddMenuForm(null)}
                  />
                )}

                <div className="space-y-2 mt-3">
                  {(menus[restaurant.id] || []).map(item => (
                    <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl ${item.available ? 'bg-stone-50' : 'bg-red-50'}`}>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-stone-800 text-sm truncate">{item.name}</span>
                          {item.vegetarian && <span className="badge bg-green-100 text-green-700 text-xs">Veg</span>}
                          {!item.available && <span className="badge bg-red-100 text-red-700 text-xs">Unavailable</span>}
                        </div>
                        <span className="text-primary-600 font-semibold text-sm">₹{item.price}</span>
                        <span className="text-stone-400 text-xs ml-2">{item.category}</span>
                      </div>
                      <button onClick={() => handleToggleItem(item.id, restaurant.id)} className={`text-xs px-2 py-1 rounded-lg font-medium ${item.available ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {item.available ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => handleDeleteItem(item.id, restaurant.id)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(menus[restaurant.id] || []).length === 0 && (
                    <p className="text-stone-400 text-sm text-center py-3">No menu items yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {restaurants.length === 0 && (
          <div className="card p-12 text-center">
            <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-semibold text-stone-600">No restaurants yet</h3>
            <p className="text-stone-400 text-sm mt-1">Add your first restaurant to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
