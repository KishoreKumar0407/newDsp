import React from 'react'
import { Link } from 'react-router-dom'
import { PRODUCE_CATEGORIES, getAllProducts } from '../../lib/consumerData.js'
import { getCart } from '../../lib/consumerData.js'

export default function ConsumerHomepage() {
  const cart = getCart()
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const allProducts = getAllProducts()

  return (
    <div className="min-h-screen bg-v2v-softwhite dark:bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-v2v-gradient to-indigo-600 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">AgriMap Consumer Marketplace</h1>
          <p className="text-xl text-slate-800 mb-8">
            Fresh produce directly from farmers. Retail shopping and bulk buying for businesses.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/consumer/products"
              className="bg-white text-v2v-deep px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors"
            >
              🛒 Retail Shopping
            </Link>
            <Link
              to="/consumer/bulk-buying"
              className="bg-v2v-lavender text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              🏭 Bulk Buying
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">Why Choose AgriMap?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-v2v-border dark:border-slate-700">
            <div className="text-4xl mb-4">🥬</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Fresh from Farmers</h3>
            <p className="text-slate-600 dark:text-slate-400">Direct from farm to your doorstep with quality assurance.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-v2v-border dark:border-slate-700">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">AI-Powered Pricing</h3>
            <p className="text-slate-600 dark:text-slate-400">Fair prices with AI recommendations and market intelligence.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-v2v-border dark:border-slate-700">
            <div className="text-4xl mb-4">🏭</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Bulk Buying</h3>
            <p className="text-slate-600 dark:text-slate-400">Special pricing for businesses and bulk orders.</p>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(PRODUCE_CATEGORIES).map(([key, category]) => (
            <Link
              key={key}
              to={`/consumer/products?category=${key}`}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-v2v-border dark:border-slate-700 hover:border-v2v-lavender dark:hover:border-purple-400 text-center"
            >
              <div className="text-5xl mb-3">{category.icon}</div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{category.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {allProducts.filter(p => p.category === key).length} products
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* AI-Powered Bulk Buying Banner */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-v2v-lavender to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">AI-Powered Bulk Buying</h2>
              <p className="text-purple-100 text-lg">
                Find the perfect produce for your needs. Specify your requirements and let our AI match you with suitable lots.
              </p>
              <ul className="mt-4 space-y-2 text-purple-100">
                <li>✓ Specify intended use (retail, processing, manufacturing)</li>
                <li>✓ Set quality and ripeness requirements</li>
                <li>✓ Get AI-recommended products based on your needs</li>
                <li>✓ Intelligent pricing with bulk discounts</li>
              </ul>
            </div>
            <Link
              to="/consumer/bulk-buying"
              className="bg-white text-v2v-deep px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-colors text-center whitespace-nowrap"
            >
              Try Bulk Buying →
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Featured Products</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {allProducts.slice(0, 3).map(product => (
            <Link
              key={product.id}
              to={`/consumer/product/${product.id}`}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-v2v-border dark:border-slate-700 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-6xl">
                {PRODUCE_CATEGORIES[product.category]?.icon || '🥬'}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{product.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{product.variety} • {product.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-2xl font-bold text-v2v-deep dark:text-purple-400">₹{product.pricePerKg}/kg</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{product.availableQuantity} kg</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cart Floating Button */}
      {cartItemsCount > 0 && (
        <Link
          to="/consumer/cart"
          className="fixed bottom-6 right-6 bg-v2v-gradient text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-v2v-lavender text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartItemsCount}
            </span>
          </div>
        </Link>
      )}
    </div>
  )
}
