import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const NavigationLoaderContext = createContext(null)

/**
 * DotsRingLoader
 * High-performance, brand-aligned loading spinner using V2V Tech purple and violet palette.
 * Built with CSS animations, accessible roles, and full respects to prefers-reduced-motion.
 */
export function DotsRingLoader({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size] || 'w-14 h-14'

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`relative inline-flex items-center justify-center ${sizeClasses} ${className}`}
    >
      {/* Outer animated gradient ring */}
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-v2v-purple border-r-v2v-softlavender border-b-purple-500/20 border-l-v2v-deep animate-spin motion-reduce:animate-none" />
      
      {/* Middle pulsing glow */}
      <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-v2v-lavender/50 animate-[spin_3s_linear_infinite_reverse] motion-reduce:animate-none" />

      {/* Inner pulsating core dot */}
      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-v2v-deep to-v2v-purple shadow-[0_0_12px_rgba(138,87,192,0.8)] animate-pulse" />

      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * PageTransitionLoader
 * Fullscreen semi-transparent backdrop overlay with brand violet glassmorphism.
 */
export function PageTransitionLoader({ isLoading, message = 'Loading workspace...' }) {
  if (!isLoading) return null

  return (
    <div
      role="alert"
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/60 dark:bg-black/75 backdrop-blur-sm transition-all duration-300"
    >
      <div className="bg-white/90 dark:bg-slate-900/90 border border-v2v-purple/30 dark:border-purple-500/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 shadow-2xl shadow-purple-950/40 text-center max-w-sm mx-4 animate-fadeIn">
        <DotsRingLoader size="lg" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-sans tracking-wide">
            {message}
          </p>
          <span className="text-xs text-v2v-purple dark:text-purple-300 font-medium font-mono">
            V2V Tech · Digital Farmland Platform
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * NavigationLoaderProvider
 * Context provider managing state and timed transitions with clean timer cleanup.
 */
export function NavigationLoaderProvider({ children }) {
  const [loadingState, setLoadingState] = useState({
    active: false,
    message: 'Loading...',
  })
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Compute starting page / dashboard according to active role
  const getStartingPage = useCallback(() => {
    if (!user) return '/'
    const role = user.role || 'farmer'
    if (role === 'farmer') return '/farmer'
    if (role === 'admin' || role === 'verifier') return '/admin/farmers'
    if (role === 'consumer' || role === 'dealer') return '/marketplace'
    return '/dashboard'
  }, [user])

  const startLoader = useCallback((message = 'Loading...', durationMs = 1200, callback) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setLoadingState({ active: true, message })

    timerRef.current = setTimeout(() => {
      setLoadingState({ active: false, message: '' })
      if (typeof callback === 'function') {
        callback()
      }
    }, durationMs)
  }, [])

  const stopLoader = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setLoadingState({ active: false, message: '' })
  }, [])

  /**
   * navigateWithLoader:
   * Triggers loader for `durationMs` (default 1.2s), then navigates seamlessly.
   */
  const navigateWithLoader = useCallback(
    (to, options = {}, message = 'Transitioning...', durationMs = 1200) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setLoadingState({ active: true, message })

      timerRef.current = setTimeout(() => {
        setLoadingState({ active: false, message: '' })
        if (typeof to === 'number') {
          navigate(to)
        } else {
          navigate(to, options)
        }
      }, durationMs)
    },
    [navigate]
  )

  /**
   * navigateBackWithLoader:
   * Navigates to history -1 if available; otherwise falls back safely to starting page/home.
   */
  const navigateBackWithLoader = useCallback(
    (fallbackPath, message = 'Returning to previous screen...', durationMs = 1000) => {
      const targetFallback = fallbackPath || getStartingPage()
      const hasHistory =
        window.history.state &&
        typeof window.history.state.idx === 'number' &&
        window.history.state.idx > 0

      if (hasHistory) {
        navigateWithLoader(-1, {}, message, durationMs)
      } else {
        navigateWithLoader(targetFallback, { replace: true }, message, durationMs)
      }
    },
    [getStartingPage, navigateWithLoader]
  )

  /**
   * navigateHomeWithLoader:
   * Logo click navigation directly to user's dashboard/starting page (no login flash).
   */
  const navigateHomeWithLoader = useCallback(
    (message = 'Opening Dashboard...', durationMs = 1200) => {
      const homePath = getStartingPage()
      navigateWithLoader(homePath, {}, message, durationMs)
    },
    [getStartingPage, navigateWithLoader]
  )

  return (
    <NavigationLoaderContext.Provider
      value={{
        isLoading: loadingState.active,
        loadingMessage: loadingState.message,
        startLoader,
        stopLoader,
        navigateWithLoader,
        navigateBackWithLoader,
        navigateHomeWithLoader,
        getStartingPage,
      }}
    >
      {children}
      <PageTransitionLoader
        isLoading={loadingState.active}
        message={loadingState.message}
      />
    </NavigationLoaderContext.Provider>
  )
}

export function useNavigateWithLoader() {
  const context = useContext(NavigationLoaderContext)
  if (!context) {
    throw new Error('useNavigateWithLoader must be used within NavigationLoaderProvider')
  }
  return context
}
