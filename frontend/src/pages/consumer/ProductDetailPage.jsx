import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEMO_PRODUCTS, PRODUCE_CATEGORIES, GRADE_CLASSIFICATIONS, RIPENESS_STAGES, addToCart, getCart } from '../../lib/consumerData.js'
import { getPricingRecommendation, generatePriceTiers, calculateTotalCost } from '../../lib/aiPricingEngine.js'
import { getMarketPriceComparison, getDemandAnalysis } from '../../lib/marketIntelligence.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const foundProduct = DEMO_PRODUCTS.find(p => p.id === id)
    setProduct(foundProduct)
    setCart(getCart())
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      const updatedCart = addToCart(product, quantity)
      setCart(updatedCart)
      alert(`${product.name} (${quantity}kg) added to cart!`)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <Link to="/consumer/products" className="text-green-600 hover:text-green-700 font-bold">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const pricing = getPricingRecommendation(product)
  const priceTiers = generatePriceTiers(product)
  const marketComparison = getMarketPriceComparison(product)
  const demand = getDemandAnalysis(product.category)
  const totalCost = calculateTotalCost(product, quantity)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/consumer/products" className="text-green-600 hover:text-green-700 font-bold">
              ← Back to Products
            </Link>
            <span className="text-gray-600">DEMO PRODUCT DETAILS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-9xl">
              {PRODUCE_CATEGORIES[product.category]?.icon || '🥬'}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isOrganic && (
                  <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                    Organic Certified
                  </span>
                )}
                <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                  Quality Score: {product.qualityScore}/100
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.variety}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Farmer</p>
                <p className="font-bold text-gray-800">{product.farmerName}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-bold text-gray-800">{product.location}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Harvest Date</p>
                <p className="font-bold text-gray-800">{product.harvestDate}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Shelf Life</p>
                <p className="font-bold text-gray-800">{product.shelfLifeDays} days</p>
              </div>
            </div>

            {/* Grade and Ripeness */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Grade</p>
                  <p className="font-bold text-gray-800 flex items-center gap-2">
                    {GRADE_CLASSIFICATIONS[product.grade]?.icon} {GRADE_CLASSIFICATIONS[product.grade]?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ripeness</p>
                  <p className="font-bold text-gray-800 flex items-center gap-2">
                    {RIPENESS_STAGES[product.ripeness]?.icon} {RIPENESS_STAGES[product.ripeness]?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Pricing Recommendation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                🤖 AI Price Recommendation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Recommended Price:</span>
                  <span className="text-2xl font-bold text-blue-700">₹{pricing.recommendedPrice}/kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Price Range:</span>
                  <span className="text-gray-800">₹{pricing.priceRange.min} - ₹{pricing.priceRange.max}/kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Confidence Level:</span>
                  <span className="text-gray-800">{(pricing.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Factors considered:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pricing.explanation.map((factor, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-500">•</span> {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-blue-600 italic mt-3">
                  * All pricing recommendations are simulated for demonstration
                </p>
              </div>
            </div>

            {/* Market Comparison */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Market Comparison
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Current Price:</span>
                  <span className="font-bold text-gray-800">₹{marketComparison.currentPrice}/kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Market Price ({marketComparison.marketSource}):</span>
                  <span className="font-bold text-gray-800">₹{marketComparison.marketPrice}/kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Difference:</span>
                  <span className={`font-bold ${marketComparison.isBelowMarket ? 'text-green-600' : 'text-red-600'}`}>
                    {marketComparison.isBelowMarket ? '↓' : '↑'} ₹{Math.abs(marketComparison.priceDifference)}/kg
                    ({marketComparison.percentageDifference}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Demand Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📈 Demand Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Current Demand:</span>
                  <span className={`font-bold ${demand.current === 'High' || demand.current === 'Very High' ? 'text-green-600' : 'text-gray-800'}`}>
                    {demand.current}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Season:</span>
                  <span className="font-bold text-gray-800">{demand.season}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Demand Trend:</span>
                  <span className="font-bold text-gray-800">{demand.demand}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{demand.forecast}</p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.availableQuantity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Total Cost</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalCost.totalCost.toLocaleString()}</p>
                  {totalCost.savings > 0 && (
                    <p className="text-sm text-green-600">
                      Save ₹{totalCost.savings} ({totalCost.savingsPercentage}% discount)
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={quantity > product.availableQuantity}
                className={`w-full py-3 rounded-lg font-bold ${
                  quantity <= product.availableQuantity
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors`}
              >
                Add to Cart
              </button>
              {quantity > product.availableQuantity && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Only {product.availableQuantity} kg available
                </p>
              )}
            </div>

            {/* Bulk Price Tiers */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                💰 Bulk Price Tiers
              </h3>
              <div className="space-y-2">
                {priceTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      quantity >= tier.minQuantity && quantity <= tier.maxQuantity
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {tier.minQuantity} - {tier.maxQuantity} kg
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">₹{tier.pricePerKg}/kg</span>
                      <span className="text-sm text-green-600 ml-2">{tier.discount} off</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
