import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../lib/consumerData.js'

export default function DealerOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dealer" className="text-blue-600 hover:text-blue-700 font-bold">
              ← Back to Home
            </Link>
            <span className="text-gray-600">MY ORDERS (DEMO)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your wholesale order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/dealer/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">Order #{order.id.slice(-8)}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'delivered' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Order Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.customer?.businessName && (
                      <p className="text-sm text-gray-500">
                        Business: {order.customer.businessName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{item.name} ({item.quantity} kg)</span>
                        <span>₹{(item.pricePerKg * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.customer && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">Delivery Details:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Contact</p>
                        <p className="font-medium text-gray-800">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{order.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">{order.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment</p>
                        <p className="font-medium text-gray-800">{order.payment.method}</p>
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
