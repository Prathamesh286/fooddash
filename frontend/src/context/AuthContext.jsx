import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    const data = res.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (formData) => {
    const res = await authApi.register(formData)
    const data = res.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
