import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Clock, Bike, Flame } from 'lucide-react'
import { restaurantApi } from '../services/api'
import toast from 'react-hot-toast'

const CUISINES = ['All', 'Indian', 'Italian', 'Chinese', 'American', 'Mexican', 'Thai']

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRestaurants()
  }, [])

  useEffect(() => {
    let result = restaurants
    if (cuisine !== 'All') result = result.filter(r => r.cuisine === cuisine)
    if (search) result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine?.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [search, cuisine, restaurants])

  const loadRestaurants = async () => {
    try {
      const res = await restaurantApi.getAll()
      setRestaurants(res.data)
      setFiltered(res.data)
    } catch {
      toast.error('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-orange-400 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-8xl">🍕</div>
          <div className="absolute bottom-4 right-32 text-6xl">🍜</div>
          <div className="absolute top-8 right-56 text-5xl">🍔</div>
        </div>
        <div className="relative max-w-xl">
          <h1 className="font-display text-4xl font-bold mb-2">Hungry? 🍽️</h1>
          <p className="text-orange-100 text-lg mb-6">Order from the best restaurants near you</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              className="w-full bg-white text-stone-800 pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cuisine filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CUISINES.map(c => (
          <button
            key={c}
            onClick={() => setCuisine(c)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
              cuisine === c
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-primary-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-4 h-4 text-primary-500" />
        <span className="text-sm text-stone-600 font-medium">
          {filtered.length} restaurants available
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-stone-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(r => (
            <Link key={r.id} to={`/restaurant/${r.id}`} className="card group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!r.open && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-stone-700 text-sm font-semibold px-3 py-1 rounded-full">Closed</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-stone-700">{r.rating || '4.0'}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 text-base group-hover:text-primary-600 transition-colors">{r.name}</h3>
                <p className="text-stone-500 text-xs mt-0.5">{r.cuisine}</p>
                <div className="flex items-center gap-3 mt-3 text-stone-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {r.deliveryTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5" />
                    ₹{r.deliveryFee} delivery
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-stone-400">Min order: ₹{r.minOrderAmount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-stone-700">No restaurants found</h3>
          <p className="text-stone-400 mt-1">Try a different search or cuisine</p>
        </div>
      )}
    </div>
  )
}
