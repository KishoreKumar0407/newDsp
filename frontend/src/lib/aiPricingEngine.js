/**
 * aiPricingEngine.js — Rule-based AI pricing recommendations
 * 
 * All pricing recommendations are SIMULATED for demonstration purposes.
 * Not a trained ML model - uses rule-based logic with confidence levels.
 */

import { MARKET_PRICES, GRADE_CLASSIFICATIONS, RIPENESS_STAGES } from './consumerData.js'

// ── Price Recommendation Engine ───────────────────────────────────────────────
export function getPricingRecommendation(product) {
  const marketPrice = MARKET_PRICES[product.category]?.price || product.pricePerKg
  const grade = GRADE_CLASSIFICATIONS[product.grade]
  const ripeness = RIPENESS_STAGES[product.ripeness]
  
  // Base price adjustment factors
  let priceAdjustment = 1.0
  let explanation = []
  
  // Grade adjustment
  if (product.grade === 'premium_fresh') {
    priceAdjustment += 0.2
    explanation.push('Premium grade (+20%)')
  } else if (product.grade === 'standard_grade') {
    priceAdjustment += 0.0
    explanation.push('Standard grade (base price)')
  } else if (product.grade === 'processing_grade') {
    priceAdjustment -= 0.3
    explanation.push('Processing grade (-30%)')
  } else if (product.grade === 'surplus_short_dated') {
    priceAdjustment -= 0.4
    explanation.push('Surplus/short-dated (-40%)')
  }
  
  // Ripeness adjustment
  if (product.ripeness === 'ripe') {
    priceAdjustment += 0.05
    explanation.push('Optimal ripeness (+5%)')
  } else if (product.ripeness === 'overripe') {
    priceAdjustment -= 0.15
    explanation.push('Overripe (-15%)')
  } else if (product.ripeness === 'unripe') {
    priceAdjustment -= 0.1
    explanation.push('Unripe (-10%)')
  }
  
  // Organic premium
  if (product.isOrganic) {
    priceAdjustment += 0.15
    explanation.push('Organic certification (+15%)')
  }
  
  // Shelf life adjustment
  if (product.shelfLifeDays <= 3) {
    priceAdjustment -= 0.2
    explanation.push('Short shelf life (-20%)')
  } else if (product.shelfLifeDays >= 14) {
    priceAdjustment += 0.05
    explanation.push('Long shelf life (+5%)')
  }
  
  // Quality score adjustment
  if (product.qualityScore >= 90) {
    priceAdjustment += 0.1
    explanation.push('High quality score (+10%)')
  } else if (product.qualityScore < 70) {
    priceAdjustment -= 0.1
    explanation.push('Lower quality score (-10%)')
  }
  
  // Calculate recommended price
  const recommendedPrice = Math.round(marketPrice * priceAdjustment)
  const minPrice = Math.round(recommendedPrice * 0.9)
  const maxPrice = Math.round(recommendedPrice * 1.1)
  
  // Confidence level based on data quality
  let confidence = 0.75
  if (product.qualityScore >= 90) confidence = 0.85
  if (product.shelfLifeDays >= 7) confidence += 0.05
  if (product.isOrganic) confidence += 0.05
  confidence = Math.min(0.95, confidence)
  
  return {
    recommendedPrice,
    priceRange: { min: minPrice, max: maxPrice },
    confidence,
    explanation,
    isSimulated: true,
    marketPrice,
    marketSource: MARKET_PRICES[product.category]?.source || 'APMC Reference',
  }
}

// ── Bulk Price Tiers ─────────────────────────────────────────────────────────────
export function generatePriceTiers(product) {
  const basePrice = product.pricePerKg
  const tiers = [
    { minQuantity: 10, maxQuantity: 49, pricePerKg: basePrice, discount: '0%' },
    { minQuantity: 50, maxQuantity: 99, pricePerKg: Math.round(basePrice * 0.95), discount: '5%' },
    { minQuantity: 100, maxQuantity: 499, pricePerKg: Math.round(basePrice * 0.90), discount: '10%' },
    { minQuantity: 500, maxQuantity: 999, pricePerKg: Math.round(basePrice * 0.85), discount: '15%' },
    { minQuantity: 1000, maxQuantity: 9999, pricePerKg: Math.round(basePrice * 0.80), discount: '20%' },
  ]
  return tiers
}

// ── Total Cost Calculation ───────────────────────────────────────────────────────
export function calculateTotalCost(product, quantity) {
  const tiers = generatePriceTiers(product)
  let applicableTier = tiers[0]
  
  for (const tier of tiers) {
    if (quantity >= tier.minQuantity && quantity <= tier.maxQuantity) {
      applicableTier = tier
      break
    }
  }
  
  const totalPrice = applicableTier.pricePerKg * quantity
  const baseTotal = product.pricePerKg * quantity
  const savings = baseTotal - totalPrice
  const savingsPercentage = Math.round((savings / baseTotal) * 100)
  
  return {
    totalCost: totalPrice,
    applicablePrice: applicableTier.pricePerKg,
    discount: applicableTier.discount,
    savings,
    savingsPercentage,
  }
}
