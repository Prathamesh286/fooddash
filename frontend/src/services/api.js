import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// Restaurants
export const restaurantApi = {
  getAll: (search) => api.get('/restaurants', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getMy: () => api.get('/restaurants/my'),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  toggle: (id) => api.patch(`/restaurants/${id}/toggle`),
}

// Menu
export const menuApi = {
  getByRestaurant: (restaurantId) => api.get(`/menu/restaurant/${restaurantId}`),
  add: (restaurantId, data) => api.post(`/menu/restaurant/${restaurantId}`, data),
  update: (itemId, data) => api.put(`/menu/${itemId}`, data),
  toggle: (itemId) => api.patch(`/menu/${itemId}/toggle`),
  delete: (itemId) => api.delete(`/menu/${itemId}`),
}

// Orders
export const orderApi = {
  place: (data) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  getRestaurantOrders: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`),
  getAll: () => api.get('/orders/all'),
  getAgentOrders: () => api.get('/orders/agent'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, null, { params: { status } }),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
}

// Reviews
export const reviewApi = {
  add: (data) => api.post('/reviews', data),
  getByRestaurant: (restaurantId) => api.get(`/reviews/restaurant/${restaurantId}`),
}

export default api
