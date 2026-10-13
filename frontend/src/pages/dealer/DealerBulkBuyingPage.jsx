import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCE_CATEGORIES, DEMO_PRODUCTS, INTENDED_USES, RIPENESS_STAGES, GRADE_CLASSIFICATIONS, addToCart, getCart } from '../../lib/consumerData.js'
import { matchBuyerDemand } from '../../lib/marketIntelligence.js'

export default function DealerBulkBuyingPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dealer" className="text-indigo-600 hover:text-indigo-700 font-bold">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">AI-POWERED BULK BUYING (DEMO)</span>
              {cartItemsCount > 0 && (
                <Link
                  to="/dealer/cart"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI-Powered Bulk Buying (Dealer)</h1>
          <p className="text-gray-600">
            Specify your requirements and let our AI match you with the perfect produce lots.
            All data is simulated for demonstration purposes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🎯 Your Requirements
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Category *</label>
                  <select
                    value={requirements.product}
                    onChange={(e) => setRequirements({ ...requirements, product: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {Object.entries(PRODUCE_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>{category.icon} {category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intended Use *</label>
                  <select
                    value={requirements.intendedUse}
                    onChange={(e) => setRequirements({ ...requirements, intendedUse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select use case</option>
                    {INTENDED_USES.map(use => (
                      <option key={use.id} value={use.id}>{use.name}</option>
                    ))}
                  </select>
                  {requirements.intendedUse && (
                    <p className="text-xs text-gray-500 mt-1">
                      {INTENDED_USES.find(u => u.id === requirements.intendedUse)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Quantity (kg) *</label>
                  <input
                    type="number"
                    value={requirements.requiredQuantity}
                    onChange={(e) => setRequirements({ ...requirements, requiredQuantity: e.target.value })}
                    placeholder="e.g., 500"
                    min="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Ripeness</label>
                  <select
                    value={requirements.preferredRipeness}
                    onChange={(e) => setRequirements({ ...requirements, preferredRipeness: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Any ripeness</option>
                    {Object.entries(RIPENESS_STAGES).map(([key, ripeness]) => (
                      <option key={key} value={key}>{ripeness.icon} {ripeness.name} ({ripeness.daysToRipe} days)</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget (₹)</label>
                    <input
                      type="number"
                      value={requirements.minBudget}
                      onChange={(e) => setRequirements({ ...requirements, minBudget: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget (₹)</label>
                    <input
                      type="number"
                      value={requirements.maxBudget}
                      onChange={(e) => setRequirements({ ...requirements, maxBudget: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md"
                >
                  🤖 Find Matching Products
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!hasSearched ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Perfect Produce</h2>
                <p className="text-gray-600 mb-4">
                  Fill in your requirements on the left and let our AI find the best matching lots from farmers.
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 inline-block">
                  <p className="text-sm text-indigo-800">
                    <strong>AI Features:</strong> Ripeness matching, quality analysis, price optimization, and suitability scoring
                  </p>
                </div>
              </div>
            ) : matchedProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No matching products found</h2>
                <p className="text-gray-600 mb-4">Try adjusting your requirements or filters</p>
                <button
                  onClick={() => setHasSearched(false)}
                  className="text-indigo-600 hover:text-indigo-700 underline"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Found {matchedProducts.length} Matching Lots
                </h2>
                <div className="space-y-4">
                  {matchedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="lg:w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-6xl flex-shrink-0">
                          {PRODUCE_CATEGORIES[product.category]?.icon || '🥬'}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                              <p className="text-sm text-gray-500">{product.variety} • {product.location}</p>
                            </div>
                            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
                              {product.suitabilityScore}% Match
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {GRADE_CLASSIFICATIONS[product.grade]?.name}
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                              {RIPENESS_STAGES[product.ripeness]?.name}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {product.availableQuantity} kg available
                            </span>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Why this match:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {product.matchReasons.map((reason, i) => (
                                <li key={i}>• {reason}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div>
                              <p className="text-sm text-gray-500">Estimated Total:</p>
                              <p className="text-2xl font-bold text-blue-600">₹{product.estimatedTotalCost.toLocaleString()}</p>
                              {product.estimatedSavings > 0 && (
                                <p className="text-sm text-blue-600">
                                  Save ₹{product.estimatedSavings.toLocaleString()} vs market price
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product, requirements.requiredQuantity)}
                              className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                              Add to Cart →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Demo Mode:</strong> All prices, recommendations, and market data are simulated for demonstration purposes. 
              Real-time market integration will be available when connected to actual APMC data sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
