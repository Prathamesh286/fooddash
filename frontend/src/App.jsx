import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerRestaurantsPage from './pages/OwnerRestaurantsPage'
import AgentOrdersPage from './pages/AgentOrdersPage'
import AdminPage from './pages/AdminPage'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#1c1917',
                color: '#fafaf9',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Layout-wrapped routes */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/restaurant/:id" element={<AppLayout><RestaurantPage /></AppLayout>} />

            {/* Customer routes */}
            <Route path="/cart" element={
              <AppLayout>
                <ProtectedRoute roles={['CUSTOMER']}>
                  <CartPage />
                </ProtectedRoute>
              </AppLayout>
            } />
            <Route path="/orders" element={
              <AppLayout>
                <ProtectedRoute roles={['CUSTOMER']}>
                  <OrdersPage />
                </ProtectedRoute>
              </AppLayout>
            } />

            {/* Owner routes */}
            <Route path="/owner/dashboard" element={
              <AppLayout>
                <ProtectedRoute roles={['RESTAURANT_OWNER', 'ADMIN']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              </AppLayout>
            } />
            <Route path="/owner/restaurants" element={
              <AppLayout>
                <ProtectedRoute roles={['RESTAURANT_OWNER', 'ADMIN']}>
                  <OwnerRestaurantsPage />
                </ProtectedRoute>
              </AppLayout>
            } />

            {/* Agent routes */}
            <Route path="/agent/orders" element={
              <AppLayout>
                <ProtectedRoute roles={['DELIVERY_AGENT']}>
                  <AgentOrdersPage />
                </ProtectedRoute>
              </AppLayout>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <AppLayout>
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              </AppLayout>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
