import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, clearCart, saveOrder, getCartTotal } from '../../lib/consumerData.js'

export default function CheckoutPage() {
  const [cart, setCart] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'upi',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadedCart = getCart()
    if (loadedCart.length === 0) {
      navigate('/consumer/cart')
      return
    }
    setCart(loadedCart)
  }, [navigate])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create order
    const order = {
      items: cart,
      total: getCartTotal(),
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      delivery: {
        date: formData.deliveryDate,
        time: formData.deliveryTime,
      },
      payment: {
        method: formData.paymentMethod,
      },
    }

    const savedOrder = saveOrder(order)
    clearCart()
    setOrderId(savedOrder.id)
    setOrderPlaced(true)
    setIsProcessing(false)
  }

  const cartTotal = getCartTotal()

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-v2v-softwhite flex items-center justify-center">
        <div className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Order Placed Successfully!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Your order has been confirmed</p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">Order ID</p>
            <p className="text-xl font-bold text-v2v-deep dark:text-purple-400">{orderId}</p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You will receive a confirmation email at {formData.email}
          </p>
          <div className="space-y-3">
            <Link
              to="/consumer/orders"
              className="block w-full py-3 bg-v2v-gradient text-white rounded-lg font-bold hover:opacity-90 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              to="/consumer"
              className="block w-full py-3 bg-slate- dark:bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 dark:text-slate-300 rounded-lg font-medium hover:bg-slate- dark:bg-slate-200 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-v2v-softwhite">
      {/* Header */}
      <div className="bg-white dark:bg-slate- dark:bg-slate-800 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/consumer/cart" className="text-v2v-deep dark:text-purple-400 hover:text-v2v-deep dark:text-purple-400 font-bold">
              ← Back to Cart
            </Link>
            <span className="text-slate-600 dark:text-slate-400">CHECKOUT (DEMO)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Checkout</h1>
          <p className="text-slate-600 dark:text-slate-400">Complete your order details</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="123 Main Street, Apartment 4B"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Preferences */}
            <div className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Delivery Preferences</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                    Preferred Time Slot
                  </label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value="">Select time slot</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-v2v-deep dark:text-purple-400"
                    />
                    <span>UPI / GPay</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-v2v-deep dark:text-purple-400"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-v2v-deep dark:text-purple-400"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                {formData.paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@upi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                )}

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">{item.quantity} kg × ₹{item.pricePerKg}/kg</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">₹{(item.pricePerKg * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
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
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total</span>
                    <span className="text-2xl font-bold text-v2v-deep dark:text-purple-400">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <p className="text-sm text-blue-700">
                  <strong>Demo Mode:</strong> No real payment will be processed. This is a simulated checkout for demonstration purposes.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-bold ${
                  isProcessing
                    ? 'bg-slate- dark:bg-slate-300 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-v2v-gradient to-indigo-600 text-white hover:from-green-700 hover:to-emerald-700'
                } transition-all shadow-md`}
              >
                {isProcessing ? 'Processing...' : `Place Order • ₹${cartTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
