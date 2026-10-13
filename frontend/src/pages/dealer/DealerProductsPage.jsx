import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PRODUCE_CATEGORIES, DEMO_PRODUCTS, GRADE_CLASSIFICATIONS, RIPENESS_STAGES, addToCart, getCart } from '../../lib/consumerData.js'
import { getPricingRecommendation } from '../../lib/aiPricingEngine.js'

export default function DealerProductsPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [filteredProducts, setFilteredProducts] = useState(DEMO_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedRipeness, setSelectedRipeness] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(p => p.grade === selectedGrade)
    }

    if (selectedRipeness !== 'all') {
      filtered = filtered.filter(p => p.ripeness === selectedRipeness)
    }

    filtered = filtered.filter(p => p.pricePerKg >= priceRange.min && p.pricePerKg <= priceRange.max)

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.variety.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.farmerName.toLowerCase().includes(term)
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, selectedGrade, selectedRipeness, priceRange, searchTerm, products])

  const handleAddToCart = (product) => {
    const updatedCart = addToCart(product, 10) // Default 10kg for dealers
    setCart(updatedCart)
    alert(`${product.name} (10kg) added to cart!`)
  }

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dealer" className="text-blue-600 hover:text-blue-700 font-bold">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">DEALER MARKETPLACE</span>
              {cartItemsCount > 0 && (
                <Link
                  to="/dealer/cart"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  🛒 Cart ({cartItemsCount})
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Products (Wholesale)</h1>
          <p className="text-gray-600">All data is simulated for demonstration purposes</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(PRODUCE_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Grades</option>
                  {Object.entries(GRADE_CLASSIFICATIONS).map(([key, grade]) => (
                    <option key={key} value={key}>{grade.icon} {grade.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ripeness</label>
                <select
                  value={selectedRipeness}
                  onChange={(e) => setSelectedRipeness(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Ripeness</option>
                  {Object.entries(RIPENESS_STAGES).map(([key, ripeness]) => (
                    <option key={key} value={key}>{ripeness.icon} {ripeness.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹/kg)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 500 })}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedGrade('all')
                  setSelectedRipeness('all')
                  setPriceRange({ min: 0, max: 500 })
                }}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
              <Link to="/dealer/bulk-buying" className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                🏭 Try Bulk Buying
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl">
                    {PRODUCE_CATEGORIES[product.category]?.icon || '🥬'}
                  </div>
                  <div className="p-4">
                    <Link to={`/dealer/product/${product.id}`}>
                      <h3 className="font-bold text-gray-800 hover:text-blue-600">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">{product.variety} • {product.location}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {GRADE_CLASSIFICATIONS[product.grade]?.name}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        {RIPENESS_STAGES[product.ripeness]?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-2xl font-bold text-blue-600">₹{product.pricePerKg}/kg</span>
                      <span className="text-sm text-gray-500">{product.availableQuantity} kg</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add 10kg
                      </button>
                      <Link
                        to={`/dealer/product/${product.id}`}
                        className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSelectedGrade('all')
                    setSelectedRipeness('all')
                    setPriceRange({ min: 0, max: 500 })
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
