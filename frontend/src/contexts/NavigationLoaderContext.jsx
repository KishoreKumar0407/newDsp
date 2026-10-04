import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const NavigationLoaderContext = createContext(null)

/**
 * MinimalSpinner
 * Minimalist, ultra-clean, elegant brand loader with subtle high-contrast ring.
 */
export function MinimalSpinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[2.5px]',
  }
  const s = sizeMap[size] || sizeMap.md

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`inline-block rounded-full border-solid border-v2v-purple/20 border-t-v2v-purple animate-spin motion-reduce:animate-none ${s} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * PageTransitionLoader
 * Ultra-minimalist top progress bar with subtle, modern floating pill badge.
 * Non-intrusive, extremely sleek and professional.
 */
export function PageTransitionLoader({ isLoading, message = 'Loading...' }) {
  if (!isLoading) return null

  return (
    <div
      role="alert"
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[9999] pointer-events-none flex flex-col justify-start items-center transition-opacity duration-200"
    >
      {/* ── Top edge progress line ── */}
      <div className="w-full h-1 bg-transparent overflow-hidden">
        <div className="h-full bg-gradient-to-r from-v2v-deep via-v2v-purple to-purple-400 w-full animate-[pulse_1s_ease-in-out_infinite]" />
      </div>

      {/* ── Minimalist floating status pill ── */}
      <div className="mt-4 pointer-events-auto">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 dark:bg-slate-950/95 text-white backdrop-blur-md shadow-lg border border-slate-700/50 text-xs font-medium tracking-wide animate-fadeIn">
          <MinimalSpinner size="sm" className="border-t-purple-400" />
          <span>{message}</span>
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
