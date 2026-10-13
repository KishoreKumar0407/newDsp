import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCE_CATEGORIES, DEMO_PRODUCTS, INTENDED_USES, RIPENESS_STAGES, GRADE_CLASSIFICATIONS, addToCart, getCart } from '../../lib/consumerData.js'
import { matchBuyerDemand } from '../../lib/marketIntelligence.js'

export default function BulkBuyingPage() {
  const [requirements, setRequirements] = useState({
    product: '',
    intendedUse: '',
    requiredQuantity: '',
    preferredRipeness: '',
    minBudget: '',
    maxBudget: '',
  })
  const [matchedProducts, setMatchedProducts] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [cart, setCart] = useState([])

  const handleSearch = () => {
    if (!requirements.product || !requirements.requiredQuantity) {
      alert('Please select a product and enter required quantity')
      return
    }

    const quantity = parseInt(requirements.requiredQuantity)
    const searchReqs = {
      ...requirements,
      requiredQuantity: quantity,
      minBudget: requirements.minBudget ? parseInt(requirements.minBudget) : null,
      maxBudget: requirements.maxBudget ? parseInt(requirements.maxBudget) : null,
    }

    const matches = matchBuyerDemand(searchReqs)
    setMatchedProducts(matches)
    setHasSearched(true)
  }

  const handleAddToCart = (product, quantity) => {
    const updatedCart = addToCart(product, quantity)
    setCart(updatedCart)
    alert(`${product.name} (${quantity}kg) added to cart!`)
  }

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/consumer" className="text-orange-600 hover:text-orange-700 font-bold">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">AI-POWERED BULK BUYING (DEMO)</span>
              {cartItemsCount > 0 && (
                <Link
                  to="/consumer/cart"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI-Powered Bulk Buying</h1>
          <p className="text-gray-600">
            Specify your requirements and let our AI match you with the perfect produce lots.
            All data is simulated for demonstration purposes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Requirements Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🎯 Your Requirements
              </h2>

              <div className="space-y-4">
                {/* Product Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category *
                  </label>
                  <select
                    value={requirements.product}
                    onChange={(e) => setRequirements({ ...requirements, product: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {Object.entries(PRODUCE_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Intended Use */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intended Use *
                  </label>
                  <select
                    value={requirements.intendedUse}
                    onChange={(e) => setRequirements({ ...requirements, intendedUse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select use case</option>
                    {INTENDED_USES.map(use => (
                      <option key={use.id} value={use.id}>
                        {use.name}
                      </option>
                    ))}
                  </select>
                  {requirements.intendedUse && (
                    <p className="text-xs text-gray-500 mt-1">
                      {INTENDED_USES.find(u => u.id === requirements.intendedUse)?.description}
                    </p>
                  )}
                </div>

                {/* Required Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    value={requirements.requiredQuantity}
                    onChange={(e) => setRequirements({ ...requirements, requiredQuantity: e.target.value })}
                    placeholder="e.g., 500"
                    min="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Preferred Ripeness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Ripeness
                  </label>
                  <select
                    value={requirements.preferredRipeness}
                    onChange={(e) => setRequirements({ ...requirements, preferredRipeness: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Any ripeness</option>
                    {Object.entries(RIPENESS_STAGES).map(([key, ripeness]) => (
                      <option key={key} value={key}>
                        {ripeness.icon} {ripeness.name} ({ripeness.daysToRipe} days)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={requirements.minBudget}
                      onChange={(e) => setRequirements({ ...requirements, minBudget: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={requirements.maxBudget}
                      onChange={(e) => setRequirements({ ...requirements, maxBudget: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                >
                  🤖 Find Matching Products
                </button>

                <button
                  onClick={() => {
                    setRequirements({
                      product: '',
                      intendedUse: '',
                      requiredQuantity: '',
                      preferredRipeness: '',
                      minBudget: '',
                      maxBudget: '',
                    })
                    setMatchedProducts([])
                    setHasSearched(false)
                  }}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!hasSearched ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">AI Bulk Buying Assistant</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Fill in your requirements on the left and click "Find Matching Products" to get AI-recommended produce lots that match your needs.
                </p>
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200 max-w-md mx-auto">
                  <p className="text-sm text-orange-700">
                    <strong>How it works:</strong> Our AI analyzes product characteristics, quality scores, market prices, and your specific requirements to find the best matches with suitability scores.
                  </p>
                </div>
              </div>
            ) : matchedProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Matches Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your requirements - increase quantity range, change ripeness preference, or adjust budget constraints.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Found {matchedProducts.length} Matching Products
                  </h2>
                  <p className="text-gray-600">
                    Sorted by AI suitability score. All data is simulated for demonstration.
                  </p>
                </div>

                {matchedProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product Image */}
                      <div className="lg:w-48 flex-shrink-0">
                        <div className="h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-5xl">
                          {PRODUCE_CATEGORIES[product.category]?.icon || '🥬'}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                            <p className="text-gray-600">{product.variety}</p>
                          </div>
                          <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
                            {product.suitabilityScore}% Match
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Farmer:</span>
                            <span className="font-medium text-gray-800 ml-1">{product.farmerName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <span className="font-medium text-gray-800 ml-1">{product.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Grade:</span>
                            <span className="font-medium text-gray-800 ml-1">
                              {GRADE_CLASSIFICATIONS[product.grade]?.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ripeness:</span>
                            <span className="font-medium text-gray-800 ml-1">
                              {RIPENESS_STAGES[product.ripeness]?.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Available:</span>
                            <span className="font-medium text-gray-800 ml-1">{product.availableQuantity} kg</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Quality Score:</span>
                            <span className="font-medium text-gray-800 ml-1">{product.qualityScore}/100</span>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="bg-green-50 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-green-800 mb-2">Why this match:</p>
                          <ul className="text-sm text-green-700 space-y-1">
                            {product.matchReasons.map((reason, rIdx) => (
                              <li key={rIdx} className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <span className="text-2xl font-bold text-orange-600 ml-2">
                              ₹{product.pricePerKg}/kg
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500">Estimated Total:</p>
                            <p className="text-xl font-bold text-gray-800">
                              ₹{product.estimatedTotalCost.toLocaleString()}
                            </p>
                            {product.estimatedSavings > 0 && (
                              <p className="text-sm text-green-600">
                                Save ₹{product.estimatedSavings} vs market
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product, requirements.requiredQuantity)}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                        >
                          Add {requirements.requiredQuantity}kg to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
