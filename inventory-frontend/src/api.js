
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export const getDashboardSummary = () =>
  api.get('/dashboard/summary')

export const getProducts = () =>
  api.get('/products')

export const getLowStockProducts = () =>
  api.get('/products/low-stock')

export const getSales = () =>
  api.get('/sales')

export default api

export const addProduct = (product) =>
  api.post('/products', product)

export const updateProduct = (id, product) =>
  api.put(`/products/${id}`, product)

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`)

export const stockIn = (id, quantity) =>
  api.post(`/products/${id}/stock-in`, null, {
    params: { quantity }
  })

export const stockOut = (id, quantity) =>
  api.post(`/products/${id}/stock-out`, null, {
    params: { quantity }
  })