"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const { user, setUser } = useStore()
  const [mounted, setMounted] = useState(false)

  // Sync theme with user preferences on mount
  useEffect(() => {
    setMounted(true)

    // Apply theme from user preferences if available
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme)
    }
  }, [setTheme, user?.preferences?.theme])

  const handleThemeChange = (newTheme: string) => {
    // Update theme in next-themes
    setTheme(newTheme)

    // Update theme in user preferences
    if (user) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          theme: newTheme,
        },
      })
    }

    // Show toast notification
    toast({
      title: "Theme Changed",
      description: `Theme set to ${newTheme === "system" ? "system default" : newTheme} mode`,
      duration: 2000,
    })

    // Trigger haptic feedback if supported
    if (user?.preferences?.sound && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
