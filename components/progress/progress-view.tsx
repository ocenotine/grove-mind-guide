"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { ProgressChart } from "@/components/progress/progress-chart"
import { ConceptCloud } from "@/components/progress/concept-cloud"
import { AchievementList } from "@/components/progress/achievement-list"
import { DataInsights } from "@/components/progress/data-insights"
import { StreakCalendar } from "@/components/progress/streak-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"

export function ProgressView() {
  const { chatSessions, flashcards, user, lastActive } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate stats
  const totalSessions = chatSessions.length
  const totalMessages = chatSessions.reduce(
    (acc, session) => acc + session.messages.filter((m) => m.role !== "system").length,
    0,
  )
  const totalFlashcards = flashcards.length
  const correctAnswers = flashcards.reduce((acc, card) => acc + card.correctCount, 0)
  const incorrectAnswers = flashcards.reduce((acc, card) => acc + card.incorrectCount, 0)
  const totalAnswers = correctAnswers + incorrectAnswers
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

  // Get all concepts from chat sessions
  const allConcepts = chatSessions.flatMap((session) => session.concepts || [])

  // Generate completed challenges for streak calendar
  const generateCompletedDays = () => {
    const days = []
    const today = new Date()

    // Add current day if we have lastActive set to today
    if (lastActive === today.toDateString()) {
      days.push(today.toDateString())
    }

    // Add previous days based on streak
    for (let i = 1; i <= (user?.streak || 0); i++) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      days.push(day.toDateString())
    }

    return days
  }

  const completedChallenges = generateCompletedDays()
  const streak = user?.streak || 0

  return (
    <AppLayout>
      <div className="container max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">Track your learning journey and achievements</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streak} days</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSessions}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFlashcards}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracy}%</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="charts" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="charts" className="mt-6 space-y-6">
            <ProgressChart sessions={chatSessions} flashcards={flashcards} />
            <StreakCalendar streak={streak} completedChallenges={completedChallenges} />
          </TabsContent>
          <TabsContent value="insights" className="mt-6">
            <DataInsights />
          </TabsContent>
          <TabsContent value="concepts" className="mt-6">
            <ConceptCloud concepts={allConcepts} />
          </TabsContent>
          <TabsContent value="achievements" className="mt-6">
            <AchievementList achievements={user?.achievements || []} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
