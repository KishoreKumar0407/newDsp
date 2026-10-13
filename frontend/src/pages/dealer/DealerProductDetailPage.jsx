import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DEMO_PRODUCTS, PRODUCE_CATEGORIES, GRADE_CLASSIFICATIONS, RIPENESS_STAGES, addToCart, getCart } from '../../lib/consumerData.js'
import { getPricingRecommendation, generatePriceTiers, calculateTotalCost } from '../../lib/aiPricingEngine.js'
import { getMarketPriceComparison, getDemandAnalysis } from '../../lib/marketIntelligence.js'

export default function DealerProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(50) // Default 50kg for dealers
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <Link to="/dealer/products" className="text-blue-600 hover:text-blue-700 font-bold">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dealer/products" className="text-blue-600 hover:text-blue-700 font-bold">
              ← Back to Products
            </Link>
            <span className="text-gray-600">DEALER PRODUCT DETAILS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-9xl">
              {PRODUCE_CATEGORIES[product.category]?.icon || '🥬'}
            </div>
          </div>

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
                <p className="text-xs text-blue-600 italic mt-3">
                  * All pricing recommendations are simulated for demonstration
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Wholesale Price Tiers
              </h3>
              <div className="space-y-2">
                {priceTiers.map((tier, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>{tier.minQuantity}-{tier.maxQuantity} kg:</span>
                    <span className="font-bold">₹{tier.pricePerKg}/kg ({tier.discount} off)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (kg)</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(10, quantity - 50))}
                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(10, Number(e.target.value)))}
                    className="w-24 border rounded-lg px-3 py-2 text-center"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 50)}
                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Total Cost:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{totalCost.totalCost.toLocaleString()}</span>
                </div>
                {totalCost.savings > 0 && (
                  <div className="text-sm text-blue-700">
                    You save: ₹{totalCost.savings.toLocaleString()} ({totalCost.savingsPercentage}%)
                  </div>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Add to Cart 🛒
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
