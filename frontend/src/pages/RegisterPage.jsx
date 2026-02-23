import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: 'CUSTOMER'
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Welcome, ${user.name}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Create Account</h1>
          <p className="text-stone-500 mt-1">Join FoodDash today</p>
        </div>

        <div className="card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input className="input" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <input type="password" className="input" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                <input className="input" placeholder="9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                  <option value="DELIVERY_AGENT">Delivery Agent</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Address</label>
                <input className="input" placeholder="123 Main St, City" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
