import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../lib/consumerData.js'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br bg-v2v-softwhite">
      {/* Header */}
      <div className="bg-white dark:bg-slate- dark:bg-slate-800 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/consumer" className="text-v2v-deep dark:text-purple-400 hover:text-v2v-deep dark:text-purple-400 font-bold">
              ← Back to Home
            </Link>
            <span className="text-slate-600 dark:text-slate-400">MY ORDERS (DEMO)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">My Orders</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">No orders yet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/consumer/products"
              className="inline-block px-6 py-3 bg-v2v-gradient text-white rounded-lg font-bold hover:opacity-90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate- dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-v2v-lavender">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Order #{order.id.slice(-8)}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'confirmed' ? 'bg-purple-100 text-v2v-deep dark:text-purple-400' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'delivered' ? 'bg-purple-100 text-purple-700 dark:text-purple-300' :
                        'bg-slate- dark:bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 dark:text-slate-300'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Order Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-v2v-deep dark:text-purple-400">₹{order.total.toLocaleString()}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm bg-slate- dark:bg-slate-50 dark:bg-slate-900 p-2 rounded">
                        <span>{item.name} ({item.quantity} kg)</span>
                        <span>₹{(item.pricePerKg * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.customer && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Delivery Details:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Name</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Email</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{order.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Phone</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{order.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Payment</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{order.payment.method}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
