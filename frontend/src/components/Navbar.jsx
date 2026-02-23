import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, ChefHat, Package, UtensilsCrossed, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const role = user?.role

  const navLinks = {
    CUSTOMER: [
      { to: '/', label: 'Restaurants', icon: UtensilsCrossed },
      { to: '/orders', label: 'My Orders', icon: Package },
    ],
    RESTAURANT_OWNER: [
      { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/owner/restaurants', label: 'My Restaurants', icon: ChefHat },
    ],
    DELIVERY_AGENT: [
      { to: '/agent/orders', label: 'Deliveries', icon: Package },
    ],
    ADMIN: [
      { to: '/admin', label: 'Admin Panel', icon: LayoutDashboard },
      { to: '/', label: 'Restaurants', icon: UtensilsCrossed },
    ],
  }

  const links = role ? (navLinks[role] || []) : []

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-500 rounded-xl p-1.5">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-stone-900">FoodDash</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart - only for customers */}
            {role === 'CUSTOMER' && (
              <Link to="/cart" className="relative p-2 text-stone-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-stone-700">{user.name}</span>
                  <span className="badge bg-primary-100 text-primary-700 text-xs">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-2 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 text-sm">Register</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-stone-100">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
