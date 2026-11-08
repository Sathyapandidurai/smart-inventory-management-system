
import { useEffect, useState } from 'react'
import {
  getDashboardSummary,
  getProducts,
   getSales,
  addProduct,
  updateProduct,
  deleteProduct,
   stockIn,
  stockOut
} from './api'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import './App.css'

function App() {
  const [summary, setSummary] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
const [editingId, setEditingId] = useState(null)
const [selectedProductId, setSelectedProductId] = useState('')
const [stockQuantity, setStockQuantity] = useState('')
const [sales, setSales] = useState([])
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState('All')
const [sortOption, setSortOption] = useState('default')
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    minimumStock: ''
  })
function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
  async function loadDashboard() {
    try {
      const [summaryResponse, productsResponse] =
        await Promise.all([
          getDashboardSummary(),
          getProducts()
        ])

      setSummary(summaryResponse.data)
      setProducts(productsResponse.data)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }
const loadSales = async () => {
  try {
    const response = await getSales()
    setSales(response.data)
  } catch (err) {
    console.error('Failed to load sales:', err)
  }
}
  useEffect(() => {
  loadDashboard()
  loadSales()
}, [])
const categories = [
  'All',
  ...new Set(products.map((product) => product.category))
]

const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())

  const matchesCategory =
    selectedCategory === 'All' ||
    product.category === selectedCategory

  return matchesSearch && matchesCategory
})
const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch (sortOption) {
    case 'price-low':
      return a.price - b.price

    case 'price-high':
      return b.price - a.price

    case 'quantity-low':
      return a.quantity - b.quantity

    case 'quantity-high':
      return b.quantity - a.quantity

    default:
      return 0
  }
})
const salesChartData = sales.map((sale) => ({
  date: new Date(sale.saleDate).toLocaleDateString('en-IN'),
  revenue: Number(sale.totalAmount)
}))
  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }

  async function handleSubmit(event) {
  event.preventDefault()
  setMessage('')

  const product = {
    name: form.name.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    quantity: Number(form.quantity),
    minimumStock: Number(form.minimumStock)
  }

  try {
    if (editingId) {
      await updateProduct(editingId, product)
      setMessage('Product updated successfully!')
    } else {
      await addProduct(product)
      setMessage('Product added successfully!')
    }

    setEditingId(null)

    setForm({
      name: '',
      category: '',
      price: '',
      quantity: '',
      minimumStock: ''
    })

    await loadDashboard()
  } catch (err) {
    console.error(err)
    setMessage(
      err.response?.data?.message ||
      'Unable to save product. Please check the details.'
    )
  }
}function handleEdit(product) {
  setEditingId(product.id)

  setForm({
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
    minimumStock: product.minimumStock
  })

  setMessage('')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleDelete(id) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this product?'
  )

  if (!confirmed) return

  try {
    await deleteProduct(id)
    setMessage('Product deleted successfully!')
    await loadDashboard()
  } catch (err) {
    console.error(err)
    setMessage('Unable to delete product.')
  }
}const handleStockAction = async (type) => {
  if (!selectedProductId || !stockQuantity || Number(stockQuantity) <= 0) {
    setError('Please select a product and enter a valid quantity.')
    return
  }

  try {
    setError('')
    setMessage('')

    if (type === 'in') {
      await stockIn(selectedProductId, Number(stockQuantity))
      setMessage('Stock added successfully!')
    } else {
      await stockOut(selectedProductId, Number(stockQuantity))
      setMessage('Stock removed and sale recorded successfully!')
    }

    setStockQuantity('')
    await loadDashboard()
    await loadSales()
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Stock operation failed. Please try again.'
    )
  }
}
  if (loading) {
    return <h2 className="loading">Loading Dashboard...</h2>
  }

  if (error) {
    return <h2 className="error">{error}</h2>
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>SmartStock</h2>
        <p className="menu-title">MAIN MENU</p>
       <button
  className="menu active"
  onClick={() => scrollToSection('dashboard')}
>
  Dashboard
</button>

<button
  className="menu"
  onClick={() => scrollToSection('products')}
>
  Products
</button>

<button
  className="menu"
  onClick={() => scrollToSection('stock')}
>
  Stock Management
</button>

<button
  className="menu"
  onClick={() => scrollToSection('sales')}
>
  Sales
</button>
<button
  className="menu"
  onClick={() => scrollToSection('reports')}
>
  Reports
</button>
      </aside>

      <main className="main">
        <header className="header" id="dashboard">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to Smart Inventory Management</p>
          </div>
          <span className="admin">Admin</span>
        </header>

        <section className="cards">
          <div className="card">
            <p>Total Products</p>
            <h2>{summary.inventory.totalProducts}</h2>
          </div>

          <div className="card">
            <p>Total Stock</p>
            <h2>{summary.inventory.totalStock}</h2>
          </div>

          <div className="card">
            <p>Low Stock Items</p>
            <h2>{summary.inventory.lowStockCount}</h2>
          </div>

          <div className="card">
            <p>Total Revenue</p>
            <h2>
              ₹{Number(summary.sales.totalRevenue).toLocaleString('en-IN')}
            </h2>
          </div>
        </section>

        <section className="panel" id="products">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

          <form className="product-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              min="0"
              required
            />

            <input
              name="minimumStock"
              type="number"
              placeholder="Minimum Stock"
              value={form.minimumStock}
              onChange={handleChange}
              min="0"
              required
            />

            <button type="submit">
  {editingId ? 'Update Product' : 'Add Product'}
</button>

{editingId && (
  <button
    type="button"
    onClick={() => {
      setEditingId(null)
      setForm({
        name: '',
        category: '',
        price: '',
        quantity: '',
        minimumStock: ''
      })
      setMessage('')
    }}
  >
    Cancel
  </button>
)}
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        
        {/* STOCK MANAGEMENT */}
        <section className="panel" id="stock">
          <h2>Stock Management</h2>

          <div className="product-form">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="">Select Product</option>

              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Available: {product.quantity})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              placeholder="Enter Quantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />

            <button onClick={() => handleStockAction('in')}>
              Stock In
            </button>

            <button onClick={() => handleStockAction('out')}>
              Stock Out
            </button>
          </div>
        </section>

        {/* LOW STOCK ALERTS */}
        <section className="panel">
          <h2>Low Stock Alerts</h2>

          {products.filter(
            (product) =>
              product.quantity <= product.minimumStock
          ).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Available Quantity</th>
                  <th>Minimum Stock</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {products
                  .filter(
                    (product) =>
                      product.quantity <= product.minimumStock
                  )
                  .map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.minimumStock}</td>
                      <td>Low Stock</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>All stock levels are healthy. No low-stock alerts!</p>
          )}
        </section>

        {/* PRODUCT INVENTORY */}
        <section className="panel">
          <h2>Product Inventory</h2>
<div className="filter-container">

  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    {categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
<select
  value={sortOption}
  onChange={(e) => setSortOption(e.target.value)}
>
  <option value="default">Sort By</option>
  <option value="price-low">Price: Low to High</option>
  <option value="price-high">Price: High to Low</option>
  <option value="quantity-low">Quantity: Low to High</option>
  <option value="quantity-high">Quantity: High to Low</option>
</select>
</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
              <tbody>
 {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.quantity <= product.minimumStock
                      ? 'Low Stock'
                      : 'In Stock'}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(product)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* SALES HISTORY */}
        <section className="panel"id="sales">
          <h2>Sales History</h2>

          <table>
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Sale Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{sale.product?.name || 'Unknown'}</td>
                    <td>{sale.quantitySold}</td>
                    <td>
                      ₹{Number(sale.unitPrice).toLocaleString('en-IN')}
                    </td>
                    <td>
                      ₹{Number(sale.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      {sale.saleDate
                        ? new Date(sale.saleDate).toLocaleString('en-IN')
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No sales recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
{/* REPORTS */}
{/* REPORTS */}
<section className="panel" id="reports">
  <h2>Business Reports</h2>

  <div className="cards">
    <div className="card">
      <p>Average Sale Value</p>
      <h2>
        ₹{summary.sales.totalTransactions > 0
          ? (
              summary.sales.totalRevenue /
              summary.sales.totalTransactions
            ).toLocaleString('en-IN', {
              maximumFractionDigits: 2
            })
          : 0}
      </h2>
    </div>

    <div className="card">
      <p>Average Items Per Sale</p>
      <h2>
        {summary.sales.totalTransactions > 0
          ? (
              summary.sales.totalItemsSold /
              summary.sales.totalTransactions
            ).toFixed(1)
          : 0}
      </h2>
    </div>

    <div className="card">
      <p>Inventory Value</p>
      <h2>
        ₹{Number(
          summary.inventory.totalInventoryValue
        ).toLocaleString('en-IN')}
      </h2>
    </div>
  </div>

<div className="chart-container">
  <h3>Sales Performance</h3>

  {salesChartData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value) =>
            `₹${Number(value).toLocaleString('en-IN')}`
          }
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <p>No sales data available yet.</p>
  )}
</div>
</section>
      </main>
    </div>
  )
}

export default App
