import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      const redirectMap = {
        CUSTOMER: '/',
        RESTAURANT_OWNER: '/owner/dashboard',
        DELIVERY_AGENT: '/agent/orders',
        ADMIN: '/admin',
      }
      navigate(redirectMap[user.role] || '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { label: '🧑 Customer', email: 'customer@food.com', password: 'customer123' },
    { label: '🏪 Owner', email: 'owner@food.com', password: 'owner123' },
    { label: '🚴 Agent', email: 'agent@food.com', password: 'agent123' },
    { label: '🔑 Admin', email: 'admin@food.com', password: 'admin123' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900">FoodDash</h1>
          <p className="text-stone-500 mt-1">Sign in to your account</p>
        </div>

        <div className="card p-8 shadow-xl border-stone-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-center justify-center">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-xs text-stone-500 font-medium mb-3 text-center"> Login as</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => setForm({ email: acc.email, password: acc.password })}
                  className="text-xs p-2 bg-stone-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors text-stone-600 font-medium text-left"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-stone-500 mt-4">
            No account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
