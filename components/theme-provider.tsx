"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    console.log("[v0] ThemeProvider initialized with props:", props)
  }, []) 

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
