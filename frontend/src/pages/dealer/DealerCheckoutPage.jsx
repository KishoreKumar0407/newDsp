import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, clearCart, saveOrder, getCartTotal } from '../../lib/consumerData.js'

export default function DealerCheckoutPage() {
  const [cart, setCart] = useState([])
  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
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
      navigate('/dealer/cart')
      return
    }
    setCart(loadedCart)
  }, [navigate])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.businessName || !formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const order = {
      items: cart,
      total: getCartTotal(),
      customer: {
        businessName: formData.businessName,
        gstNumber: formData.gstNumber,
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
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Order Placed Successfully!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Your wholesale order has been confirmed</p>
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">Order ID</p>
            <p className="text-xl font-bold text-v2v-deep dark:text-purple-400">{orderId}</p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You will receive a confirmation email at {formData.email}
          </p>
          <div className="space-y-3">
            <Link
              to="/dealer/orders"
              className="block w-full py-3 bg-v2v-gradient text-white rounded-lg font-bold hover:opacity-90 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              to="/dealer"
              className="block w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-300 transition-colors"
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
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dealer/cart" className="text-v2v-deep dark:text-purple-400 hover:text-v2v-deep dark:text-purple-400 font-bold">
              ← Back to Cart
            </Link>
            <span className="text-slate-600 dark:text-slate-400">WHOLESALE CHECKOUT (DEMO)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Checkout</h1>
          <p className="text-slate-600 dark:text-slate-400">Complete your wholesale order details</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Business Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="Contact Person"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="business@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Phone *</label>
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

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="Warehouse/Shop address"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      placeholder="PIN Code"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Delivery Preferences</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Preferred Delivery Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Preferred Time Slot</label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value="">Select time slot</option>
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 8PM)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-v2v-deep dark:text-purple-400"
                  />
                  <label htmlFor="upi" className="text-slate-700 dark:text-slate-300 dark:text-slate-300">UPI Payment</label>
                </div>
                {formData.paymentMethod === 'upi' && (
                  <div>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="Enter UPI ID (e.g., business@upi)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-v2v-deep dark:text-purple-400"
                  />
                  <label htmlFor="card" className="text-slate-700 dark:text-slate-300 dark:text-slate-300">Credit/Debit Card</label>
                </div>
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Card Number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        placeholder="CVV"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="bank"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-v2v-deep dark:text-purple-400"
                  />
                  <label htmlFor="bank" className="text-slate-700 dark:text-slate-300 dark:text-slate-300">Bank Transfer</label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{item.name} ({item.quantity}kg)</span>
                    <span className="font-medium">₹{(item.pricePerKg * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 mb-6">
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

              <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-v2v-deep dark:text-purple-400">
                  <strong>Demo Mode:</strong> This is a simulated checkout. No real payments will be processed.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-v2v-gradient to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order →'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
