import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PRODUCE_CATEGORIES, DEMO_PRODUCTS, GRADE_CLASSIFICATIONS, RIPENESS_STAGES, addToCart, getCart } from '../../lib/consumerData.js'
import { getPricingRecommendation } from '../../lib/aiPricingEngine.js'

export default function ConsumerProductsPage() {
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
    // Load cart on mount
    setCart(getCart())
  }, [])

  useEffect(() => {
    // Filter products
    let filtered = products

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Grade filter
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(p => p.grade === selectedGrade)
    }

    // Ripeness filter
    if (selectedRipeness !== 'all') {
      filtered = filtered.filter(p => p.ripeness === selectedRipeness)
    }

    // Price range filter
    filtered = filtered.filter(p => p.pricePerKg >= priceRange.min && p.pricePerKg <= priceRange.max)

    // Search filter
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
    const updatedCart = addToCart(product, 1)
    setCart(updatedCart)
    alert(`${product.name} added to cart!`)
  }

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/consumer" className="text-green-600 hover:text-green-700 font-bold">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">DEMO MARKETPLACE</span>
              {cartItemsCount > 0 && (
                <Link
                  to="/consumer/cart"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Products</h1>
          <p className="text-gray-600">All data is simulated for demonstration purposes</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(PRODUCE_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.name}</option>
                  ))}
                </select>
              </div>

              {/* Grade Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Grades</option>
                  {Object.entries(GRADE_CLASSIFICATIONS).map(([key, grade]) => (
                    <option key={key} value={key}>{grade.icon} {grade.name}</option>
                  ))}
                </select>
              </div>

              {/* Ripeness Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ripeness</label>
                <select
                  value={selectedRipeness}
                  onChange={(e) => setSelectedRipeness(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Ripeness</option>
                  {Object.entries(RIPENESS_STAGES).map(([key, ripeness]) => (
                    <option key={key} value={key}>{ripeness.icon} {ripeness.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹/kg)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 500 })}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const pricing = getPricingRecommendation(product)
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
                    >
                      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-6xl">
                        {PRODUCE_CATEGORIES[product.category]?.icon || '🥬'}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-800">{product.name}</h3>
                          {product.isOrganic && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                              Organic
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{product.variety}</p>
                        <p className="text-sm text-gray-500 mb-3">
                          📍 {product.location} • 👨‍🌾 {product.farmerName}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">
                            {GRADE_CLASSIFICATIONS[product.grade]?.icon} {GRADE_CLASSIFICATIONS[product.grade]?.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {RIPENESS_STAGES[product.ripeness]?.icon} {RIPENESS_STAGES[product.ripeness]?.name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-2xl font-bold text-green-600">₹{product.pricePerKg}</span>
                            <span className="text-sm text-gray-500">/kg</span>
                          </div>
                          <span className="text-sm text-gray-500">{product.availableQuantity} kg available</span>
                        </div>

                        {/* AI Price Recommendation Badge */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                          <p className="text-xs text-blue-700 font-medium">
                            🤖 AI Recommended: ₹{pricing.recommendedPrice}/kg
                          </p>
                          <p className="text-xs text-blue-600">
                            {pricing.confidence * 100}% confidence
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/consumer/product/${product.id}`}
                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
