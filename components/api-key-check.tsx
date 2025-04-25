import type React from "react"

export function ApiKeyCheck({ children }: { children: React.ReactNode }) {
  // Simply render children without checking for API key
  return <>{children}</>
}
