/**
 * consumerData.js — Demo produce data, classifications, and cart/order management
 * 
 * All prices, recommendations, and market data are SIMULATED for demonstration purposes.
 * Not connected to real-time APMC or inventory APIs.
 */

// ── Produce Categories ───────────────────────────────────────────────────────
export const PRODUCE_CATEGORIES = {
  tomato: { id: 'tomato', name: 'Tomato', icon: '🍅' },
  onion: { id: 'onion', name: 'Onion', icon: '🧅' },
  potato: { id: 'potato', name: 'Potato', icon: '🥔' },
  banana: { id: 'banana', name: 'Banana', icon: '🍌' },
  mango: { id: 'mango', name: 'Mango', icon: '🥭' },
  rice: { id: 'rice', name: 'Rice/Paddy', icon: '🌾' },
  wheat: { id: 'wheat', name: 'Wheat', icon: '🌾' },
  chilli: { id: 'chilli', name: 'Chilli', icon: '🌶️' },
}

// ── Grade Classifications ───────────────────────────────────────────────────────
export const GRADE_CLASSIFICATIONS = {
  PREMIUM_FRESH: { id: 'premium_fresh', name: 'Premium Fresh', description: 'High-quality produce suitable for retail and premium buyers', icon: '⭐' },
  STANDARD_GRADE: { id: 'standard_grade', name: 'Standard Grade', description: 'Produce suitable for everyday consumption and commercial use', icon: '✓' },
  PROCESSING_GRADE: { id: 'processing_grade', name: 'Processing Grade', description: 'Produce suitable for food processing based on actual condition and intended use', icon: '🏭' },
  RIPE_PRODUCE: { id: 'ripe_produce', name: 'Ripe Produce', description: 'Produce at appropriate ripeness stage for immediate consumption or processing', icon: '🍅' },
  SURPLUS_SHORT_DATED: { id: 'surplus_short_dated', name: 'Surplus / Short-Dated', description: 'Produce that needs quicker sale because of limited remaining shelf life', icon: '⏰' },
}

// ── Ripeness Stages ───────────────────────────────────────────────────────────────
export const RIPENESS_STAGES = {
  UNRIPE: { id: 'unripe', name: 'Unripe', daysToRipe: '5-10', icon: '🟢' },
  SEMI_RIPE: { id: 'semi_ripe', name: 'Semi-Ripe', daysToRipe: '2-5', icon: '🟡' },
  RIPE: { id: 'ripe', name: 'Ripe', daysToRipe: '0-2', icon: '🟠' },
  OVERRIPE: { id: 'overripe', name: 'Overripe', daysToRipe: '-1 to 0', icon: '🔴' },
}

// ── Intended Uses ───────────────────────────────────────────────────────────────
export const INTENDED_USES = [
  { id: 'retail_sale', name: 'Retail Sale', description: 'For direct consumer sales' },
  { id: 'ketchup_production', name: 'Ketchup Production', description: 'For tomato-based products' },
  { id: 'juice_production', name: 'Juice Production', description: 'For fruit juices and beverages' },
  { id: 'pulp_production', name: 'Pulp Production', description: 'For purees and pulps' },
  { id: 'pickle_production', name: 'Pickle Production', description: 'For pickling and preservation' },
  { id: 'restaurant_use', name: 'Restaurant Use', description: 'For food service establishments' },
  { id: 'other_processing', name: 'Other Processing', description: 'For other food processing applications' },
]

// ── Demo Products (Simulated Inventory) ───────────────────────────────────────────
export const DEMO_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Farm Fresh Tomatoes',
    category: 'tomato',
    variety: 'Hybrid Roma',
    farmerName: 'Vignesh R.',
    location: 'Thanjavur, Tamil Nadu',
    pricePerKg: 25,
    grade: 'premium_fresh',
    ripeness: 'ripe',
    availableQuantity: 500,
    isOrganic: true,
    harvestDate: '2024-01-15',
    shelfLifeDays: 7,
    qualityScore: 95,
  },
  {
    id: 'prod-002',
    name: 'Premium Red Onions',
    category: 'onion',
    variety: 'Nasik Red',
    farmerName: 'Kishore S.',
    location: 'Karad, Maharashtra',
    pricePerKg: 30,
    grade: 'standard_grade',
    ripeness: 'ripe',
    availableQuantity: 750,
    isOrganic: false,
    harvestDate: '2024-01-14',
    shelfLifeDays: 14,
    qualityScore: 88,
  },
  {
    id: 'prod-003',
    name: 'Alphonso Mangoes (Export Grade)',
    category: 'mango',
    variety: 'Ratnagiri Alphonso',
    farmerName: 'Ravi Kumar',
    location: 'Anand, Gujarat',
    pricePerKg: 180,
    grade: 'premium_fresh',
    ripeness: 'semi_ripe',
    availableQuantity: 200,
    isOrganic: true,
    harvestDate: '2024-01-10',
    shelfLifeDays: 5,
    qualityScore: 98,
  },
  {
    id: 'prod-004',
    name: 'Processing Grade Tomatoes',
    category: 'tomato',
    variety: 'Local Variety',
    farmerName: 'Venkatesh Rao',
    location: 'Guntur, AP',
    pricePerKg: 15,
    grade: 'processing_grade',
    ripeness: 'overripe',
    availableQuantity: 1000,
    isOrganic: false,
    harvestDate: '2024-01-12',
    shelfLifeDays: 3,
    qualityScore: 65,
  },
  {
    id: 'prod-005',
    name: 'Fresh Potatoes',
    category: 'potato',
    variety: 'Jyoti',
    farmerName: 'Ramesh Patel',
    location: 'Anand, Gujarat',
    pricePerKg: 20,
    grade: 'standard_grade',
    ripeness: 'ripe',
    availableQuantity: 1200,
    isOrganic: false,
    harvestDate: '2024-01-13',
    shelfLifeDays: 21,
    qualityScore: 85,
  },
  {
    id: 'prod-006',
    name: 'Guntur Red Chillies',
    category: 'chilli',
    variety: 'Sannam S4',
    farmerName: 'Ganesh V.',
    location: 'Pollachi, TN',
    pricePerKg: 85,
    grade: 'premium_fresh',
    ripeness: 'ripe',
    availableQuantity: 300,
    isOrganic: true,
    harvestDate: '2024-01-11',
    shelfLifeDays: 10,
    qualityScore: 92,
  },
]

// ── Market Price References (Simulated) ───────────────────────────────────────────
export const MARKET_PRICES = {
  tomato: { price: 28, source: 'APMC Chennai', location: 'Chennai', timestamp: '2024-01-15' },
  onion: { price: 32, source: 'Lasalgaon APMC', location: 'Maharashtra', timestamp: '2024-01-15' },
  potato: { price: 22, source: 'APMC Ahmedabad', location: 'Gujarat', timestamp: '2024-01-15' },
  mango: { price: 200, source: 'Ratnagiri Market', location: 'Maharashtra', timestamp: '2024-01-15' },
  chilli: { price: 90, source: 'Guntur Market', location: 'Andhra Pradesh', timestamp: '2024-01-15' },
}

// ── Cart Management (localStorage) ───────────────────────────────────────────────
const CART_STORAGE_KEY = 'farmxt_cart_v1'
const ORDERS_STORAGE_KEY = 'farmxt_orders_v1'

export function getCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToCart(product, quantity = 1) {
  const cart = getCart()
  const existingItem = cart.find(item => item.productId === product.id)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      variety: product.variety,
      location: product.location,
      pricePerKg: product.pricePerKg,
      quantity,
    })
  }
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  return cart
}

export function updateCartQuantity(productId, newQuantity) {
  const cart = getCart()
  const item = cart.find(item => item.productId === productId)
  
  if (item) {
    if (newQuantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = newQuantity
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }
  
  return cart
}

export function removeFromCart(productId) {
  const cart = getCart()
  const filtered = cart.filter(item => item.productId !== productId)
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered))
  return filtered
}

export function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY)
  return []
}

export function getCartTotal() {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + (item.pricePerKg * item.quantity), 0)
}

// ── Order Management (localStorage) ─────────────────────────────────────────────
export function saveOrder(order) {
  const orders = getOrders()
  const newOrder = {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    ...order,
  }
  orders.unshift(newOrder)
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  return newOrder
}

export function getOrders() {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
