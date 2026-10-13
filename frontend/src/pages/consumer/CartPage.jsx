import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal } from '../../lib/consumerData.js'

export default function CartPage() {
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
    navigate('/consumer/checkout')
  }

  const cartTotal = getCartTotal()
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/consumer/products" className="text-green-600 hover:text-green-700 font-bold">
              ← Continue Shopping
            </Link>
            <span className="text-gray-600">SHOPPING CART (DEMO)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link
              to="/consumer/products"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Icon */}
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                    🥬
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.variety}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      📍 {item.location}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹{item.pricePerKg}</span>
                        <span className="text-sm text-gray-500">/kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Total and Remove */}
                  <div className="flex flex-col items-end justify-between border-l border-gray-200 pl-4">
                    <div>
                      <p className="text-sm text-gray-500">Item Total</p>
                      <p className="text-xl font-bold text-gray-800">₹{(item.pricePerKg * item.quantity).toLocaleString()}</p>
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

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItemsCount} items)</span>
                    <span className="font-bold text-gray-800">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span className="font-bold text-gray-800">₹0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-green-600">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Demo Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-700">
                    <strong>Demo Mode:</strong> This is a simulated shopping cart. No real payments will be processed.
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
                >
                  Proceed to Checkout →
                </button>

                <Link
                  to="/consumer/products"
                  className="block w-full py-3 mt-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
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
