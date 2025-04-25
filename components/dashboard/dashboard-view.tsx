"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { LearningStreak } from "@/components/dashboard/learning-streak"
import { TopicOfTheDay } from "@/components/dashboard/topic-of-the-day"
import { RecentFlashcards } from "@/components/dashboard/recent-flashcards"
import { DailyChallenge } from "@/components/dashboard/daily-challenge"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"

export function DashboardView() {
  const { streak, lastActive, incrementStreak, resetStreak } = useStore()
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    setMounted(true)

    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Check if we need to increment streak
    const today = new Date().toDateString()
    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      if (lastActive === yesterdayString) {
        incrementStreak()
      } else if (lastActive && lastActive !== today) {
        // Reset streak if more than a day has passed
        resetStreak()
      }

      // Update last active date
      useStore.setState({ lastActive: today })
    }
  }, [lastActive, incrementStreak, resetStreak])

  if (!mounted) return null

  return (
    <AppLayout>
      <div className="container max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{greeting}!</h1>
            <p className="text-muted-foreground">
              {streak > 0 ? `You're on a ${streak} day learning streak! 🔥` : "Start your learning journey today!"}
            </p>
          </div>
          <Link href="/chat">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <LearningStreak streak={streak} />
          <TopicOfTheDay />
        </div>

        <RecentFlashcards />

        <DailyChallenge />

        {streak === 0 && (
          <div className="mt-6 rounded-lg border border-border bg-card p-4 text-center">
            <h3 className="text-lg font-medium">Let's pick up where you left off!</h3>
            <p className="mt-2 text-muted-foreground">Start a new learning session to build your streak.</p>
            <Link href="/chat" className="mt-4 inline-block">
              <Button>Start Learning</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
