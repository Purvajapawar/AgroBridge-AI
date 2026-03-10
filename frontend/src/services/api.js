import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const register = async (userData) => (await api.post('/auth/register', userData)).data
export const login = async (credentials) => (await api.post('/auth/login', credentials)).data
export const getCurrentUser = async () => (await api.get('/auth/me')).data
export const getStates = async () => (await api.get('/auth/states')).data
export const getDistricts = async (state) => (await api.get(`/auth/districts/${state}`)).data
export const createCrop = async (cropData) => (await api.post('/crops/upload', cropData)).data
export const getAllCrops = async () => (await api.get('/crops')).data
export const getAvailableCrops = async () => (await api.get('/crops/available')).data
export const getFarmerCrops = async (farmerId) => (await api.get(`/crops/farmer/${farmerId}`)).data

export const acceptDeal = async (cropId, traderId) => {
  console.log('=== acceptDeal API === cropId:', cropId, 'traderId:', traderId)
  const payload = { cropId, traderId }
  console.log('Payload:', JSON.stringify(payload))
  const response = await api.post('/crops/accept', payload)
  console.log('Response:', response.data)
  return response.data
}

export const getPricePrediction = async (crop, state, district, expectedPrice) => {
  try {
    return (await api.get('/crops/price-prediction', { params: { crop, state, district, expectedPrice } })).data
  } catch (error) {
    const predicted = Math.round(expectedPrice * 1.15)
    return { success: true, predicted_price: predicted, suggested_price: Math.round(predicted * 0.97), recommendation: 'increase', diff: predicted - expectedPrice, source: 'local_fallback' }
  }
}

export const getTraderInventory = async (traderId) => (await api.get(`/trader/inventory/${traderId}`)).data
export const createTraderListing = async (listingData) => (await api.post('/trader/create-product', listingData)).data
export const getTraderListings = async () => (await api.get('/trader/listings')).data
export const createOrder = async (orderData) => (await api.post('/mill/orders/create', orderData)).data
export const getMillOrders = async (millId) => (await api.get(`/mill/orders/mill/${millId}`)).data
export const getAllOrders = async () => (await api.get('/mill/orders')).data
export const getMillProducts = async () => (await api.get('/mill/products')).data

const ML_SERVICE_URL = 'http://localhost:5001'
export const predictPrice = async (data) => {
  try { return (await axios.post(`${ML_SERVICE_URL}/predict-price`, data, { timeout: 5000 })).data }
  catch (error) {
    const predicted = Math.round(data.expectedPrice * 1.15)
    return { success: true, predicted_price: predicted, suggested_price: Math.round(predicted * 0.97), recommendation: 'increase', diff: predicted - data.expectedPrice, source: 'fallback' }
  }
}

export const detectQuality = async (imageFile) => {
  const formData = new FormData()
  formData.append('file', imageFile)
  try { return (await axios.post(`${ML_SERVICE_URL}/detect-quality`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 10000 })).data }
  catch (error) { return { success: true, grade: 'A', broken_percentage: 3, color_score: 8.5, source: 'fallback' } }
}

export const getFarmerAnalytics = async (farmerId) => (await api.get(`/analytics/farmer/${farmerId}`)).data
export const getTraderAnalytics = async (traderId) => (await api.get(`/analytics/trader/${traderId}`)).data
export const getMillAnalytics = async (millId) => (await api.get(`/analytics/mill/${millId}`)).data

export default api
