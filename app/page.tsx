"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Loading } from "@/components/ui/loading"

export default function Home() {
  const router = useRouter()
  const { onboardingCompleted } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if onboarding is completed
    setIsLoading(true)

    setTimeout(() => {
      if (onboardingCompleted) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
      setIsLoading(false)
    }, 500) // Small delay to prevent flash of content
  }, [onboardingCompleted, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Starting Mindgrove..." />
      </div>
    )
  }

  return null
}
