"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log("[v0] Theme state:", { theme, resolvedTheme })
    }
  }, [theme, resolvedTheme, mounted])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const handleThemeToggle = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"
    console.log("[v0] Switching theme from", resolvedTheme, "to", newTheme)
    setTheme(newTheme)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleThemeToggle}>
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
