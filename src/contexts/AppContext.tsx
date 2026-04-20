// App context: stores and provides shared global state for the UI.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { NavKey } from '../constants'

type AppContextType = {
  activeNav: NavKey
  setActiveNav: (key: NavKey) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeNav, setActiveNav] = useState<NavKey>('authors')

  const value = useMemo(
    () => ({
      activeNav,
      setActiveNav
    }),
    [activeNav]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }
  return context
}
