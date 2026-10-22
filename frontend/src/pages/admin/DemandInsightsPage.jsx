import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function DemandInsightsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [horizonDays, setHorizonDays] = useState(7)
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedDistrict, setExpandedDistrict] = useState(null)
  const [useDemoData, setUseDemoData] = useState(false)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch insights when product or horizon changes
  useEffect(() => {
    if (selectedProduct && !useDemoData) {
      fetchInsights()
    }
  }, [selectedProduct, horizonDays, useDemoData])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/demand/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        if (data.length > 0) {
          setSelectedProduct(data[0].id)
        }
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Backend not connected. Using demo mode.')
      setUseDemoData(true)
      // Use demo products
      setProducts([
        { id: 'cabbage', name: 'Cabbage', category: 'vegetable' },
        { id: 'tomato', name: 'Tomato', category: 'vegetable' },
        { id: 'onion', name: 'Onion', category: 'vegetable' },
      ])
      setSelectedProduct('cabbage')
    }
  }

  const fetchInsights = async () => {
    if (!selectedProduct) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/demand/insights?product_id=${selectedProduct}&horizon_days=${horizonDays}`
      )
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      } else {
        throw new Error('Failed to fetch insights')
      }
    } catch (err) {
      console.error('Error fetching insights:', err)
      setError('Backend not connected. Using demo mode.')
      setUseDemoData(true)
      setInsights(demoInsights)
    } finally {
      setLoading(false)
    }
  }

  // Demo insights data
  const demoInsights = {
    product_name: selectedProduct === 'cabbage' ? 'Cabbage' : selectedProduct === 'tomato' ? 'Tomato' : 'Onion',
    product_category: 'vegetable',
    horizon_days: horizonDays,
    insights: [
      {
        district_name: 'Chennai',
        district_code: 'TN02',
        rank: 1,
        demand_score: 85.5,
        demand_level: 'High',
        predicted_quantity_kg: 125000,
        confidence_level: 'High',
        factor_breakdown: {
          population: { value: 4646732, score: 92.9, weight: 30, contribution: 27.9 },
          production_gap: { value: 'low', score: 100, weight: 25, contribution: 25.0 },
          season_match: { value: 'Month 10 in season: true', score: 100, weight: 15, contribution: 15.0 },
          festival_boost: { value: 'Deepavali', score: 35, weight: 15, contribution: 5.3 },
          urban_ratio: { value: 0.9, score: 90, weight: 10, contribution: 9.0 },
          commercial_buyers: { value: 2650, score: 100, weight: 5, contribution: 5.0 },
        },
        prediction_method: 'scoring',
      },
      {
        district_name: 'Coimbatore',
        district_code: 'TN03',
        rank: 2,
        demand_score: 78.2,
        demand_level: 'High',
        predicted_quantity_kg: 95000,
        confidence_level: 'High',
        factor_breakdown: {
          population: { value: 3472378, score: 69.4, weight: 30, contribution: 20.8 },
          production_gap: { value: 'high', score: 0, weight: 25, contribution: 0.0 },
          season_match: { value: 'Month 10 in season: true', score: 100, weight: 15, contribution: 15.0 },
          festival_boost: { value: 'Deepavali', score: 35, weight: 15, contribution: 5.3 },
          urban_ratio: { value: 0.7, score: 70, weight: 10, contribution: 7.0 },
          commercial_buyers: { value: 1080, score: 100, weight: 5, contribution: 5.0 },
        },
        prediction_method: 'scoring',
      },
      {
        district_name: 'Madurai',
        district_code: 'TN12',
        rank: 3,
        demand_score: 72.8,
        demand_level: 'High',
        predicted_quantity_kg: 88000,
        confidence_level: 'Medium',
        factor_breakdown: {
          population: { value: 3034325, score: 60.7, weight: 30, contribution: 18.2 },
          production_gap: { value: 'medium', score: 50, weight: 25, contribution: 12.5 },
          season_match: { value: 'Month 10 in season: true', score: 100, weight: 15, contribution: 15.0 },
          festival_boost: { value: 'Deepavali', score: 35, weight: 15, contribution: 5.3 },
          urban_ratio: { value: 0.58, score: 58, weight: 10, contribution: 5.8 },
          commercial_buyers: { value: 620, score: 62, weight: 5, contribution: 3.1 },
        },
        prediction_method: 'scoring',
      },
      {
        district_name: 'Salem',
        district_code: 'TN19',
        rank: 4,
        demand_score: 65.4,
        demand_level: 'Medium',
        predicted_quantity_kg: 78000,
        confidence_level: 'High',
        factor_breakdown: {
          population: { value: 3482005, score: 69.6, weight: 30, contribution: 20.9 },
          production_gap: { value: 'high', score: 0, weight: 25, contribution: 0.0 },
          season_match: { value: 'Month 10 in season: true', score: 100, weight: 15, contribution: 15.0 },
          festival_boost: { value: 'None', score: 0, weight: 15, contribution: 0.0 },
          urban_ratio: { value: 0.52, score: 52, weight: 10, contribution: 5.2 },
          commercial_buyers: { value: 410, score: 41, weight: 5, contribution: 2.1 },
        },
        prediction_method: 'scoring',
      },
      {
        district_name: 'Tiruchirappalli',
        district_code: 'TN24',
        rank: 5,
        demand_score: 58.3,
        demand_level: 'Medium',
        predicted_quantity_kg: 65000,
        confidence_level: 'Medium',
        factor_breakdown: {
          population: { value: 2722290, score: 54.4, weight: 30, contribution: 16.3 },
          production_gap: { value: 'medium', score: 50, weight: 25, contribution: 12.5 },
          season_match: { value: 'Month 10 in season: true', score: 100, weight: 15, contribution: 15.0 },
          festival_boost: { value: 'None', score: 0, weight: 15, contribution: 0.0 },
          urban_ratio: { value: 0.55, score: 55, weight: 10, contribution: 5.5 },
          commercial_buyers: { value: 485, score: 48.5, weight: 5, contribution: 2.4 },
        },
        prediction_method: 'scoring',
      },
    ],
    total_districts: 5,
    generated_at: new Date(),
  }

  const getBarColor = (level) => {
    switch (level) {
      case 'High': return '#ef4444'
      case 'Medium': return '#f59e0b'
      case 'Low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getConfidenceBadgeColor = (level) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-v2v-softwhite dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">This page is only accessible to admin users.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-v2v-softwhite dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Demand Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze demand across Tamil Nadu districts based on population, production, and seasonal factors.
          </p>
          {useDemoData && (
            <div className="mt-2 px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-lg text-sm inline-block">
              ⚠️ Demo Mode: Backend not connected. Showing simulated data.
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-v2v-purple focus:border-transparent"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Horizon
              </label>
              <select
                value={horizonDays}
                onChange={(e) => setHorizonDays(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-v2v-purple focus:border-transparent"
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (useDemoData) {
                  setLoading(true)
                  setTimeout(() => {
                    setInsights(demoInsights)
                    setLoading(false)
                  }, 500)
                } else {
                  fetchInsights()
                }
              }}
              disabled={loading}
              className="px-6 py-2 bg-v2v-purple hover:bg-v2v-purple-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && !useDemoData && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !insights && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-v2v-purple"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading demand insights...</p>
          </div>
        )}

        {/* Insights Display */}
        {insights && (
          <>
            {/* Summary Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {insights.product_name} Demand Analysis
                </h2>
                <span className="px-3 py-1 bg-v2v-purple/10 text-v2v-purple dark:text-purple-300 rounded-full text-sm font-medium">
                  Based on: scoring model
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                    {insights.product_category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Horizon</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {insights.horizon_days} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Districts Analyzed</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {insights.total_districts}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Demand Score by District
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={insights.insights}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="district_name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="demand_score" name="Demand Score">
                    {insights.insights.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.demand_level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ranked Districts
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        District
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Demand Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Predicted Qty (kg)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Why?
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {insights.insights.map((insight) => (
                      <React.Fragment key={insight.district_code}>
                        <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                            #{insight.rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {insight.district_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                insight.demand_level === 'High'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : insight.demand_level === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}
                            >
                              {insight.demand_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {insight.demand_score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {insight.predicted_quantity_kg?.toLocaleString() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceBadgeColor(
                                insight.confidence_level
                              )}`}
                            >
                              {insight.confidence_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() =>
                                setExpandedDistrict(
                                  expandedDistrict === insight.district_code ? null : insight.district_code
                                )
                              }
                              className="text-v2v-purple hover:text-v2v-purple-dark dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                            >
                              {expandedDistrict === insight.district_code ? 'Hide' : 'Show details'}
                            </button>
                          </td>
                        </tr>
                        {expandedDistrict === insight.district_code && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 bg-gray-50 dark:bg-slate-700/30">
                              <div className="space-y-3">
                                <h4 className="font-medium text-slate-900 dark:text-white">Factor Breakdown</h4>
                                {Object.entries(insight.factor_breakdown).map(([factor, data]) => (
                                  <div key={factor} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                                      {factor.replace('_', ' ')}
                                    </span>
                                    <div className="flex items-center gap-4">
                                      <span className="text-gray-900 dark:text-white">
                                        {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
                                      </span>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Score: {data.score} (Weight: {data.weight}%)
                                      </span>
                                      <span className="font-medium text-v2v-purple dark:text-purple-400">
                                        +{data.contribution}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Predictions based on scoring model using population, production gap, season match, festival boost,
                urban ratio, and commercial buyers. Edit reference data to tune predictions.
              </p>
              {useDemoData && (
                <p className="mt-2 text-amber-600 dark:text-amber-400">
                  Demo Mode: This is simulated data. Connect backend for real predictions.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
