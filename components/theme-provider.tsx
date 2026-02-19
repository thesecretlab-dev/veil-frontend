"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
}

export function ThemeProvider({ children, attribute = "class", defaultTheme = "dark" }: ThemeProviderProps) {
  React.useEffect(() => {
    if (attribute === "class") {
      document.documentElement.classList.add(defaultTheme)
    }
  }, [attribute, defaultTheme])

  return <>{children}</>
}
