/**
 * marketIntelligence.js — Market intelligence and demand matching
 * 
 * All market data and recommendations are SIMULATED for demonstration purposes.
 * Not connected to real-time APMC or market APIs.
 */

import { MARKET_PRICES, DEMO_PRODUCTS, INTENDED_USES, RIPENESS_STAGES, GRADE_CLASSIFICATIONS } from './consumerData.js'

// ── Market Price Comparison ─────────────────────────────────────────────────────
export function getMarketPriceComparison(product) {
  const currentPrice = product.pricePerKg
  const marketPrice = MARKET_PRICES[product.category]?.price || currentPrice
  
  const priceDifference = currentPrice - marketPrice
  const percentageDifference = Math.round((priceDifference / marketPrice) * 100)
  
  return {
    currentPrice,
    marketPrice,
    priceDifference,
    percentageDifference,
    isBelowMarket: priceDifference < 0,
    marketSource: MARKET_PRICES[product.category]?.source || 'APMC Reference',
    marketLocation: MARKET_PRICES[product.category]?.location || 'Regional APMC',
    timestamp: MARKET_PRICES[product.category]?.timestamp || new Date().toISOString().split('T')[0],
  }
}

// ── Historical Price Trends (Simulated) ─────────────────────────────────────────────
export function getPriceTrends(category, days = 30) {
  const basePrice = MARKET_PRICES[category]?.price || 50
  const trends = []
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const randomVariation = (Math.random() - 0.5) * 10
    const trendPrice = Math.round(basePrice + randomVariation)
    trends.push({
      date: date.toISOString().split('T')[0],
      price: trendPrice,
    })
  }
  
  return trends
}

// ── Demand Analysis ─────────────────────────────────────────────────────────────
export function getDemandAnalysis(category) {
  const demandLevels = ['Low', 'Moderate', 'High', 'Very High']
  const seasonalFactors = {
    tomato: { current: 'High', season: 'Winter harvest season', demand: 'Strong' },
    onion: { current: 'Moderate', season: 'Post-harvest period', demand: 'Stable' },
    potato: { current: 'Moderate', season: 'Storage period', demand: 'Stable' },
    mango: { current: 'Very High', season: 'Peak season', demand: 'Exceptional' },
    chilli: { current: 'High', season: 'Harvest season', demand: 'Strong' },
  }
  
  const categoryData = seasonalFactors[category] || { current: 'Moderate', season: 'Regular', demand: 'Stable' }
  
  return {
    current: categoryData.current,
    season: categoryData.season,
    demand: categoryData.demand,
    forecast: 'Expected to remain stable for next 2 weeks',
  }
}

// ── Surplus Produce Identification ─────────────────────────────────────────────
export function identifySurplusProduce() {
  return DEMO_PRODUCTS.filter(product => 
    product.grade === 'surplus_short_dated' || 
    product.shelfLifeDays <= 5 ||
    product.availableQuantity > 500
  ).map(product => ({
    ...product,
    reason: product.grade === 'surplus_short_dated' ? 'Short-dated inventory' :
              product.shelfLifeDays <= 5 ? 'Limited shelf life' :
              'High available quantity',
    recommendedAction: 'Offer bulk discount or process quickly',
  }))
}

// ── Bulk Buyer Demand Matching ─────────────────────────────────────────────────────
export function matchBuyerDemand(requirements) {
  const { product, intendedUse, requiredQuantity, preferredRipeness, minBudget, maxBudget } = requirements
  
  let matchedProducts = DEMO_PRODUCTS.filter(p => {
    // Category match
    if (product && p.category !== product) return false
    
    // Quantity availability
    if (requiredQuantity && p.availableQuantity < requiredQuantity) return false
    
    // Budget constraints
    const totalCost = p.pricePerKg * requiredQuantity
    if (minBudget && totalCost < minBudget) return false
    if (maxBudget && totalCost > maxBudget) return false
    
    // Ripeness preference
    if (preferredRipeness && p.ripeness !== preferredRipeness) {
      // For processing, allow ripeness flexibility
      if (intendedUse !== 'ketchup_production' && intendedUse !== 'juice_production') {
        return false
      }
    }
    
    return true
  })
  
  // Calculate suitability score and add match reasons
  matchedProducts = matchedProducts.map(p => {
    let score = 70 // Base score
    const reasons = []
    
    // Ripeness suitability
    if (p.ripeness === preferredRipeness) {
      score += 15
      reasons.push(`Perfect ripeness match: ${RIPENESS_STAGES[p.ripeness].name}`)
    } else if (intendedUse === 'ketchup_production' && p.ripeness === 'overripe') {
      score += 10
      reasons.push('Overripe suitable for ketchup production')
    } else if (intendedUse === 'juice_production' && p.ripeness === 'ripe') {
      score += 10
      reasons.push('Ripe produce good for juice extraction')
    }
    
    // Grade suitability
    if (intendedUse === 'retail_sale' && p.grade === 'premium_fresh') {
      score += 10
      reasons.push('Premium grade ideal for retail')
    } else if (intendedUse.includes('production') && p.grade === 'processing_grade') {
      score += 10
      reasons.push('Processing grade suitable for manufacturing')
    }
    
    // Quantity availability
    if (p.availableQuantity >= requiredQuantity * 1.5) {
      score += 5
      reasons.push('Good quantity buffer available')
    }
    
    // Quality score
    if (p.qualityScore >= 90) {
      score += 5
      reasons.push('High quality score')
    }
    
    // Price competitiveness
    const marketPrice = MARKET_PRICES[p.category]?.price || p.pricePerKg
    if (p.pricePerKg < marketPrice) {
      score += 5
      reasons.push('Price below market average')
    }
    
    // Organic certification
    if (p.isOrganic && intendedUse === 'retail_sale') {
      score += 5
      reasons.push('Organic certification premium')
    }
    
    score = Math.min(100, score)
    
    const estimatedTotalCost = p.pricePerKg * requiredQuantity
    const marketTotalCost = marketPrice * requiredQuantity
    const estimatedSavings = marketTotalCost - estimatedTotalCost
    
    return {
      ...p,
      suitabilityScore: score,
      matchReasons: reasons,
      estimatedTotalCost,
      estimatedSavings: Math.max(0, estimatedSavings),
    }
  })
  
  // Sort by suitability score
  matchedProducts.sort((a, b) => b.suitabilityScore - a.suitabilityScore)
  
  return matchedProducts
}

// ── Farmer Selling Recommendations ─────────────────────────────────────────────
export function getFarmerSellingRecommendations(product) {
  const marketPrice = MARKET_PRICES[product.category]?.price || product.pricePerKg
  const priceDiff = product.pricePerKg - marketPrice
  const demand = getDemandAnalysis(product.category)
  
  let recommendation = 'Hold'
  let reason = ''
  
  if (priceDiff > 0 && demand.current === 'High') {
    recommendation = 'Sell Now'
    reason = 'Price above market and high demand - optimal selling conditions'
  } else if (priceDiff < 0 && demand.current === 'High') {
    recommendation = 'Consider Raising Price'
    reason = 'High demand but price below market - potential for better pricing'
  } else if (product.shelfLifeDays <= 3) {
    recommendation = 'Sell Immediately'
    reason = 'Limited shelf life - quick sale recommended'
  } else if (demand.current === 'Very High') {
    recommendation = 'Sell Now'
    reason = 'Exceptional market demand - take advantage of current prices'
  } else if (demand.current === 'Low') {
    recommendation = 'Hold if Possible'
    reason = 'Low market demand - consider storage if shelf life permits'
  }
  
  return {
    recommendation,
    reason,
    currentPrice: product.pricePerKg,
    marketPrice,
    demandLevel: demand.current,
    demandTrend: demand.demand,
  }
}

// ── Buyer Purchasing Recommendations ─────────────────────────────────────────────
export function getBuyerPurchasingRecommendations(category, intendedUse) {
  const demand = getDemandAnalysis(category)
  const trends = getPriceTrends(category, 7)
  
  // Calculate average price from last 7 days
  const avgPrice = Math.round(trends.reduce((sum, t) => sum + t.price, 0) / trends.length)
  const currentPrice = trends[trends.length - 1].price
  const priceTrend = currentPrice > avgPrice ? 'Rising' : currentPrice < avgPrice ? 'Falling' : 'Stable'
  
  let timing = 'Neutral'
  let timingReason = ''
  
  if (priceTrend === 'Rising' && demand.current === 'High') {
    timing = 'Buy Soon'
    timingReason = 'Prices rising with high demand - consider purchasing before further increase'
  } else if (priceTrend === 'Falling' && demand.current === 'Moderate') {
    timing = 'Wait if Possible'
    timingReason = 'Prices trending down with moderate demand - may get better deals'
  } else if (demand.current === 'Very High') {
    timing = 'Buy Now'
    timingReason = 'Exceptional demand - immediate purchase recommended'
  }
  
  return {
    timing,
    timingReason,
    currentPrice,
    averagePrice: avgPrice,
    priceTrend,
    demandLevel: demand.current,
    season: demand.season,
  }
}
