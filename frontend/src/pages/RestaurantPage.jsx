import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Clock, Bike, MapPin, Plus, Minus, ShoppingCart, Leaf } from 'lucide-react'
import { restaurantApi, menuApi, reviewApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RestaurantPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [reviews, setReviews] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('All')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('menu')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const { cart, addToCart, removeFromCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    Promise.all([
      restaurantApi.getById(id),
      menuApi.getByRestaurant(id),
      reviewApi.getByRestaurant(id)
    ]).then(([rRes, mRes, revRes]) => {
      setRestaurant(rRes.data)
      setMenu(mRes.data)
      setReviews(revRes.data)
      const cats = ['All', ...new Set(mRes.data.map(item => item.category).filter(Boolean))]
      setCategories(cats)
    }).catch(() => toast.error('Failed to load restaurant'))
    .finally(() => setLoading(false))
  }, [id])

  const getQuantityInCart = (itemId) => {
    const cartItem = cart.find(c => c.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddReview = async (e) => {
    e.preventDefault()
    try {
      await reviewApi.add({ restaurantId: parseInt(id), ...reviewForm })
      toast.success('Review added!')
      const revRes = await reviewApi.getByRestaurant(id)
      setReviews(revRes.data)
      setReviewForm({ rating: 5, comment: '' })
    } catch {
      toast.error('Failed to add review')
    }
  }

  const filteredMenu = selectedCat === 'All' ? menu : menu.filter(i => i.category === selectedCat)

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
      <div className="h-64 bg-stone-200 rounded-2xl" />
      <div className="h-8 bg-stone-200 rounded w-1/3" />
    </div>
  )

  if (!restaurant) return <div className="text-center py-16 text-stone-500">Restaurant not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero Image */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
        <img
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="font-display text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-white/80 mt-1">{restaurant.cuisine} • {restaurant.openingHours}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-2 rounded-xl">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-stone-800">{restaurant.rating}</span>
          <span className="text-stone-500 text-sm">({restaurant.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-2 rounded-xl">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-stone-700 text-sm font-medium">{restaurant.deliveryTime} min</span>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-2 rounded-xl">
          <Bike className="w-4 h-4 text-green-500" />
          <span className="text-stone-700 text-sm font-medium">₹{restaurant.deliveryFee} delivery</span>
        </div>
        <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-2 rounded-xl">
          <MapPin className="w-4 h-4 text-stone-400" />
          <span className="text-stone-600 text-sm">{restaurant.address}</span>
        </div>
      </div>

      {restaurant.description && (
        <p className="text-stone-500 mb-6">{restaurant.description}</p>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-xl mb-6 w-fit">
        {['menu', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-white shadow text-stone-900' : 'text-stone-500'
            }`}
          >
            {tab} {tab === 'reviews' && `(${reviews.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'menu' && (
        <div>
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCat === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu items */}
          <div className="space-y-3">
            {filteredMenu.map(item => {
              const qty = getQuantityInCart(item.id)
              return (
                <div key={item.id} className={`card flex items-center gap-4 p-4 ${!item.available ? 'opacity-50' : ''}`}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.vegetarian && (
                        <div className="w-4 h-4 border-2 border-green-500 rounded-sm flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      )}
                      <h3 className="font-semibold text-stone-900 truncate">{item.name}</h3>
                    </div>
                    {item.description && <p className="text-stone-500 text-sm mt-0.5 line-clamp-2">{item.description}</p>}
                    <p className="text-primary-600 font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {!item.available ? (
                      <span className="badge bg-stone-100 text-stone-500">Unavailable</span>
                    ) : qty === 0 ? (
                      <button
                        onClick={() => addToCart(item, restaurant.id, restaurant.name)}
                        className="btn-primary py-1.5 px-4 text-sm"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-primary-50 rounded-xl p-1">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                          <Minus className="w-3 h-3 text-stone-700" />
                        </button>
                        <span className="w-6 text-center font-bold text-primary-700 text-sm">{qty}</span>
                        <button onClick={() => addToCart(item, restaurant.id, restaurant.name)} className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center shadow-sm hover:bg-primary-600 transition-colors">
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {user?.role === 'CUSTOMER' && (
            <form onSubmit={handleAddReview} className="card p-5 mb-6">
              <h3 className="font-semibold text-stone-900 mb-4">Write a Review</h3>
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewForm({...reviewForm, rating: n})}
                    className={`w-8 h-8 rounded-full transition-colors ${n <= reviewForm.rating ? 'text-yellow-400' : 'text-stone-200'}`}>
                    <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'fill-yellow-400' : ''}`} />
                  </button>
                ))}
              </div>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
              />
              <button type="submit" className="btn-primary mt-3">Submit Review</button>
            </form>
          )}

          {reviews.map(rev => (
            <div key={rev.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-stone-900">{rev.customerName}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-stone-200'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-stone-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-stone-600 text-sm">{rev.comment}</p>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-8 text-stone-400">No reviews yet. Be the first!</div>
          )}
        </div>
      )}

      {/* Floating cart button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <Link to="/cart" className="flex items-center gap-3 bg-primary-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl hover:bg-primary-600 transition-all">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">View Cart</span>
            <span className="bg-white text-primary-600 font-bold px-2.5 py-0.5 rounded-full text-sm">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
