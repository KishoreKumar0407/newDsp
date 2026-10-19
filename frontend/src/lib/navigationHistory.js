/**
 * navigationHistory.js
 * Comprehensive navigation history tracker and smart Go Back controller.
 * Ensures Go Back ALWAYS redirects to the actual previous page or logical parent,
 * regardless of browser state, page reloads, direct URL hits, or role.
 */
import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const STORAGE_KEY = 'agrimap_nav_trail'

/**
 * Get current trail from sessionStorage
 */
export function getNavTrail() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Save trail to sessionStorage
 */
export function saveNavTrail(trail) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trail.slice(-40)))
  } catch {
    // ignore
  }
}

/**
 * Record a visited route into the stack
 */
export function recordNavRoute(pathname, search = '') {
  if (!pathname) return
  const full = pathname + (search || '')
  const trail = getNavTrail()

  // Avoid recording identical consecutive routes
  if (trail.length === 0 || trail[trail.length - 1] !== full) {
    trail.push(full)
    saveNavTrail(trail)
  }
}

/**
 * Contextual fallback map for routes when no prior history exists
 */
export function getContextualFallback(pathname, role) {
  if (!pathname) return '/'

  // Consumer Portal
  if (pathname.startsWith('/consumer/product/')) return '/consumer/products'
  if (pathname === '/consumer/checkout') return '/consumer/cart'
  if (pathname === '/consumer/cart') return '/consumer/products'
  if (pathname === '/consumer/orders') return '/consumer/products'
  if (pathname === '/consumer/bulk-buying') return '/consumer'
  if (pathname === '/consumer/products') return '/consumer'
  if (pathname === '/consumer') return '/'

  // Dealer Portal
  if (pathname.startsWith('/dealer/product/')) return '/dealer/products'
  if (pathname === '/dealer/checkout') return '/dealer/cart'
  if (pathname === '/dealer/cart') return '/dealer/products'
  if (pathname === '/dealer/orders') return '/dealer/products'
  if (pathname === '/dealer/bulk-buying') return '/dealer/products'
  if (pathname === '/dealer/products') return '/dealer'
  if (pathname === '/dealer') return '/'

  // Farmer & Surveyor Sell
  if (pathname === '/farmer/sell') return '/farmer'
  if (pathname === '/surveyor/sell') return '/farmer'
  if (pathname === '/farmer') return '/'

  // Admin / Verifier
  if (pathname.startsWith('/admin/editor/')) return '/admin/farmers'
  if (pathname === '/admin/surveyors') return '/admin/farmers'
  if (pathname === '/dashboard') return '/admin/farmers'
  if (pathname.startsWith('/projects/')) return '/admin/farmers'
  if (pathname.startsWith('/map/')) return '/admin/farmers'
  if (pathname.startsWith('/iot')) return '/admin/farmers'
  if (pathname === '/data-tools') return '/admin/farmers'
  if (pathname === '/admin/farmers') return '/'

  // Public
  if (pathname === '/marketplace') return '/'
  if (pathname === '/showcase') return '/login'
  if (pathname === '/login' || pathname === '/') return '/showcase'

  // Default based on role
  if (role === 'farmer') return '/farmer'
  if (role === 'admin' || role === 'verifier') return '/admin/farmers'
  if (role === 'consumer') return '/consumer'
  if (role === 'dealer') return '/dealer'

  return '/'
}

/**
 * Smart Go Back:
 * 1. Checks internal trail stack for previous route.
 * 2. Checks browser history idx.
 * 3. Falls back to smart contextual parent route.
 */
export function executeSmartGoBack(navigate, location, role) {
  const current = location.pathname + (location.search || '')
  const trail = getNavTrail()

  // Pop current route from trail if present at end
  while (trail.length > 0 && trail[trail.length - 1] === current) {
    trail.pop()
  }

  if (trail.length > 0) {
    const prev = trail.pop()
    saveNavTrail(trail)
    if (prev && prev !== current) {
      navigate(prev)
      return
    }
  }

  // Check if browser has valid backward history inside this session
  if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
    navigate(-1)
    return
  }

  // Fallback to logical contextual parent route
  const fallback = getContextualFallback(location.pathname, role)
  navigate(fallback)
}

/**
 * React hook to track navigation and get handleGoBack function
 */
export function useSmartGoBack() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const role = user?.role || 'farmer'

  // Automatically record each navigation step
  useEffect(() => {
    recordNavRoute(location.pathname, location.search)
  }, [location.pathname, location.search])

  const handleGoBack = useCallback((e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
      e.stopPropagation()
    }
    executeSmartGoBack(navigate, location, role)
  }, [navigate, location, role])

  return { handleGoBack }
}
