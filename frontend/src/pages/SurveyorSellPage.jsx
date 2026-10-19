import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCE_CATEGORIES, GRADE_CLASSIFICATIONS, RIPENESS_STAGES, addFarmerProduct, getFarmerProductsByFarmer, deleteFarmerProduct } from '../lib/consumerData.js'
import { getPricingRecommendation } from '../lib/aiPricingEngine.js'
import { useSmartGoBack } from '../lib/navigationHistory.js'

// Demo farmers list (in real app, this would come from the database)
const DEMO_FARMERS = [
  { id: 1, name: 'Ganesh V.', location: 'Pollachi, TN' },
  { id: 2, name: 'Vignesh R.', location: 'Thanjavur, TN' },
  { id: 3, name: 'Kishore S.', location: 'Karad, Maharashtra' },
  { id: 4, name: 'Ravi Kumar', location: 'Anand, Gujarat' },
  { id: 5, name: 'Venkatesh Rao', location: 'Guntur, AP' },
  { id: 6, name: 'Ramesh Patel', location: 'Anand, Gujarat' },
]

export default function SurveyorSellPage() {
  const { handleGoBack } = useSmartGoBack()
  const [selectedFarmer, setSelectedFarmer] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    category: '',
    grade: 'standard_grade',
    ripeness: 'ripe',
    availableQuantity: '',
    harvestDate: '',
    shelfLifeDays: '7',
    location: '',
    isOrganic: false,
    qualityScore: 85,
  })
  const [aiPrice, setAiPrice] = useState(null)
  const [farmerProducts, setFarmerProducts] = useState([])
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false)

  useEffect(() => {
    if (selectedFarmer) {
      loadFarmerProducts()
    }
  }, [selectedFarmer])

  const loadFarmerProducts = () => {
    const products = getFarmerProductsByFarmer(selectedFarmer)
    setFarmerProducts(products)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const generateAIPrice = () => {
    if (!formData.name || !formData.category || !formData.availableQuantity) {
      alert('Please fill in product name, category, and quantity to generate AI price')
      return
    }

    if (!selectedFarmer) {
      alert('Please select a farmer first')
      return
    }

    setIsGeneratingPrice(true)

    setTimeout(() => {
      const tempProduct = {
        name: formData.name,
        variety: formData.variety || formData.name,
        category: formData.category,
        grade: formData.grade,
        ripeness: formData.ripeness,
        availableQuantity: parseInt(formData.availableQuantity),
        qualityScore: formData.qualityScore,
        isOrganic: formData.isOrganic,
        location: formData.location || DEMO_FARMERS.find(f => f.name === selectedFarmer)?.location || 'Unknown',
        harvestDate: formData.harvestDate || new Date().toISOString().split('T')[0],
        shelfLifeDays: parseInt(formData.shelfLifeDays),
        farmerName: selectedFarmer,
      }

      const pricing = getPricingRecommendation(tempProduct)
      setAiPrice(pricing)
      setIsGeneratingPrice(false)
    }, 1500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!aiPrice) {
      alert('Please generate AI price first')
      return
    }

    if (!selectedFarmer) {
      alert('Please select a farmer')
      return
    }

    const newProduct = {
      name: formData.name,
      variety: formData.variety || formData.name,
      category: formData.category,
      grade: formData.grade,
      ripeness: formData.ripeness,
      availableQuantity: parseInt(formData.availableQuantity),
      pricePerKg: aiPrice.recommendedPrice,
      harvestDate: formData.harvestDate || new Date().toISOString().split('T')[0],
      shelfLifeDays: parseInt(formData.shelfLifeDays),
      location: formData.location || DEMO_FARMERS.find(f => f.name === selectedFarmer)?.location || 'Unknown',
      isOrganic: formData.isOrganic,
      qualityScore: formData.qualityScore,
      farmerName: selectedFarmer,
      aiPriceData: aiPrice,
    }

    addFarmerProduct(newProduct)
    alert(`Product added successfully for ${selectedFarmer}! It will now be visible in Consumer and Dealer portals.`)
    
    setFormData({
      name: '',
      variety: '',
      category: '',
      grade: 'standard_grade',
      ripeness: 'ripe',
      availableQuantity: '',
      harvestDate: '',
      shelfLifeDays: '7',
      location: '',
      isOrganic: false,
      qualityScore: 85,
    })
    setAiPrice(null)
    loadFarmerProducts()
  }

  const handleDelete = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteFarmerProduct(productId)
      loadFarmerProducts()
    }
  }

  return (
    <div className="min-h-screen bg-v2v-softwhite dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-v2v-purple hover:text-white dark:hover:bg-purple-900 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer transition-all"
        >
          <span className="text-sm font-black">←</span>
          <span>Back to Farmland Studio</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Surveyor - Add Farmer Goods</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select a farmer and add their available goods. AI will generate pricing based on current market conditions.
            All data is simulated for demonstration purposes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add Product Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Add Product</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Farmer *
                </label>
                <select
                  value={selectedFarmer}
                  onChange={(e) => setSelectedFarmer(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="">Select a farmer</option>
                  {DEMO_FARMERS.map((farmer) => (
                    <option key={farmer.id} value={farmer.name}>
                      {farmer.name} - {farmer.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Fresh Tomatoes"
                  className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Variety
                </label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleInputChange}
                  placeholder="e.g., Hybrid Tomato"
                  className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="">Select category</option>
                  {Object.entries(PRODUCE_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Grade *
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                  >
                    {Object.entries(GRADE_CLASSIFICATIONS).map(([key, grade]) => (
                      <option key={key} value={key}>{grade.icon} {grade.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ripeness *
                  </label>
                  <select
                    name="ripeness"
                    value={formData.ripeness}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                  >
                    {Object.entries(RIPENESS_STAGES).map(([key, ripeness]) => (
                      <option key={key} value={key}>{ripeness.icon} {ripeness.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Available Quantity (kg) *
                </label>
                <input
                  type="number"
                  name="availableQuantity"
                  value={formData.availableQuantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="e.g., 500"
                  className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Shelf Life (days)
                  </label>
                  <input
                    type="number"
                    name="shelfLifeDays"
                    value={formData.shelfLifeDays}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Thanjavur, Tamil Nadu"
                  className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isOrganic"
                  id="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-v2v-lavender focus:ring-v2v-lavender"
                />
                <label htmlFor="isOrganic" className="text-sm text-slate-700 dark:text-slate-300">
                  Organic Certified
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Quality Score (1-100)
                </label>
                <input
                  type="number"
                  name="qualityScore"
                  value={formData.qualityScore}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-v2v-border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-v2v-lavender dark:focus:ring-purple-400 focus:border-transparent dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="button"
                onClick={generateAIPrice}
                disabled={isGeneratingPrice}
                className="w-full py-3 bg-v2v-electric text-white rounded-lg font-bold hover:bg-v2v-violet transition-colors disabled:opacity-50"
              >
                {isGeneratingPrice ? '🤖 Generating AI Price...' : '🤖 Generate AI Price'}
              </button>

              {aiPrice && (
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">AI Price Recommendation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Recommended Price:</span>
                      <span className="text-2xl font-bold text-v2v-deep dark:text-purple-400">₹{aiPrice.recommendedPrice}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Price Range:</span>
                      <span className="text-slate-900 dark:text-slate-100">₹{aiPrice.priceRange.min} - ₹{aiPrice.priceRange.max}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Confidence:</span>
                      <span className="text-slate-900 dark:text-slate-100">{(aiPrice.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                      * Based on current market conditions, quality, and demand
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!aiPrice}
                className="w-full py-3 bg-v2v-gradient text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Product for {selectedFarmer || 'Farmer'}
              </button>
            </form>
          </div>

          {/* Farmer's Products List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {selectedFarmer ? `${selectedFarmer}'s Products (${farmerProducts.length})` : 'Select a farmer to view products'}
            </h2>
            
            {!selectedFarmer ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">Please select a farmer from the dropdown above</p>
              </div>
            ) : farmerProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No products added for this farmer yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {farmerProducts.map((product) => (
                  <div key={product.id} className="border border-v2v-border dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">{product.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{product.variety}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Category:</span>
                        <span className="text-slate-900 dark:text-slate-100 ml-1">{PRODUCE_CATEGORIES[product.category]?.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Quantity:</span>
                        <span className="text-slate-900 dark:text-slate-100 ml-1">{product.availableQuantity} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Price:</span>
                        <span className="text-v2v-deep dark:text-purple-400 font-bold ml-1">₹{product.pricePerKg}/kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Grade:</span>
                        <span className="text-slate-900 dark:text-slate-100 ml-1">{GRADE_CLASSIFICATIONS[product.grade]?.name}</span>
                      </div>
                    </div>
                    {product.isOrganic && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Organic
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
