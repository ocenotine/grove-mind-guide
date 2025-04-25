"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useStore } from "@/lib/store"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { settings } = useStore()

  // Apply theme from settings on mount
  React.useEffect(() => {
    // This will run on client-side only
    if (typeof window !== "undefined") {
      const storedSettings = localStorage.getItem("mindgrove-storage")
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings)
          if (parsed.state?.settings?.theme) {
            const theme = parsed.state.settings.theme

            // Apply the theme
            if (theme === "system") {
              const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
              document.documentElement.classList.toggle("dark", systemTheme === "dark")
            } else {
              document.documentElement.classList.toggle("dark", theme === "dark")
            }
          }
        } catch (e) {
          console.error("Error parsing stored settings", e)
        }
      }
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
