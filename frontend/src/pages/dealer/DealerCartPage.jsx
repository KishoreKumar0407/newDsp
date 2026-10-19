import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal } from '../../lib/consumerData.js'
import { useSmartGoBack } from '../../lib/navigationHistory.js'

export default function DealerCartPage() {
  const { handleGoBack } = useSmartGoBack()
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    setCart(getCart())
  }

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateCartQuantity(productId, newQuantity)
    loadCart()
  }

  const handleRemoveItem = (productId) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart(productId)
      loadCart()
    }
  }

  const handleClearCart = () => {
    if (confirm('Clear all items from cart?')) {
      clearCart()
      loadCart()
    }
  }

  const handleCheckout = () => {
    navigate('/dealer/checkout')
  }

  const cartTotal = getCartTotal()
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br bg-v2v-softwhite">
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="text-v2v-deep dark:text-purple-400 hover:text-v2v-lavender dark:hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              ← Continue Shopping
            </button>
            <span className="text-slate-600 dark:text-slate-400">WHOLESALE CART (DEMO)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Your Cart</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Your cart is empty</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Start shopping to add items to your cart</p>
            <Link
              to="/dealer/products"
              className="inline-block px-6 py-3 bg-v2v-gradient text-white rounded-lg font-bold hover:opacity-90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div
                  key={item.productId}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                    🥬
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{item.variety}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">📍 {item.location}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-v2v-deep dark:text-purple-400">₹{item.pricePerKg}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">/kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, Math.max(10, item.quantity - 10))}
                          className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center font-bold hover:bg-slate-200 dark:bg-slate-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-slate-900 dark:text-slate-100">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 10)}
                          className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center font-bold hover:bg-slate-200 dark:bg-slate-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between border-l border-slate-200 pl-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Item Total</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">₹{(item.pricePerKg * item.quantity).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClearCart}
                className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal ({cartItemsCount} items)</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Delivery Fee</span>
                    <span className="font-bold text-v2v-deep dark:text-purple-400">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tax (GST)</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">₹0</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total</span>
                      <span className="text-2xl font-bold text-v2v-deep dark:text-purple-400">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-v2v-deep dark:text-purple-400">
                    <strong>Demo Mode:</strong> This is a simulated shopping cart. No real payments will be processed.
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-v2v-gradient to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  Proceed to Checkout →
                </button>

                <Link
                  to="/dealer/products"
                  className="block w-full py-3 mt-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:bg-slate-300 transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
