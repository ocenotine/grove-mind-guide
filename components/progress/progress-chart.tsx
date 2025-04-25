"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import type { ChatSession, Flashcard } from "@/lib/store"

interface ProgressChartProps {
  sessions: ChatSession[]
  flashcards: Flashcard[]
}

export function ProgressChart({ sessions, flashcards }: ProgressChartProps) {
  const [chartType, setChartType] = useState<"weekly" | "monthly">("weekly")

  // Process data for charts
  const processSessionData = () => {
    const now = new Date()
    const data = []

    if (chartType === "weekly") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dayStr = date.toLocaleDateString("en-US", { weekday: "short" })
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime()
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime()

        const sessionsCount = sessions.filter(
          (session) => session.createdAt >= dayStart && session.createdAt <= dayEnd,
        ).length

        const messagesCount = sessions.reduce((acc, session) => {
          if (session.createdAt >= dayStart && session.createdAt <= dayEnd) {
            return acc + session.messages.filter((m) => m.role !== "system").length
          }
          return acc
        }, 0)

        data.push({
          name: dayStr,
          sessions: sessionsCount,
          messages: messagesCount,
        })
      }
    } else {
      // Last 30 days by week
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now)
        weekStart.setDate(weekStart.getDate() - (i * 7 + 6))
        const weekEnd = new Date(now)
        weekEnd.setDate(weekEnd.getDate() - i * 7)

        const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${
          weekEnd.getMonth() + 1
        }`

        const sessionsCount = sessions.filter(
          (session) => session.createdAt >= weekStart.getTime() && session.createdAt <= weekEnd.getTime(),
        ).length

        const messagesCount = sessions.reduce((acc, session) => {
          if (session.createdAt >= weekStart.getTime() && session.createdAt <= weekEnd.getTime()) {
            return acc + session.messages.filter((m) => m.role !== "system").length
          }
          return acc
        }, 0)

        data.push({
          name: `Week ${4 - i}`,
          sessions: sessionsCount,
          messages: messagesCount,
          tooltip: weekLabel,
        })
      }
    }

    return data
  }

  const processFlashcardData = () => {
    const now = new Date()
    const data = []

    if (chartType === "weekly") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dayStr = date.toLocaleDateString("en-US", { weekday: "short" })
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime()
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime()

        const dayFlashcards = flashcards.filter(
          (card) => card.lastReviewed && card.lastReviewed >= dayStart && card.lastReviewed <= dayEnd,
        )

        const correct = dayFlashcards.reduce((acc, card) => acc + card.correctCount, 0)
        const incorrect = dayFlashcards.reduce((acc, card) => acc + card.incorrectCount, 0)

        data.push({
          name: dayStr,
          correct,
          incorrect,
        })
      }
    } else {
      // Last 30 days by week
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now)
        weekStart.setDate(weekStart.getDate() - (i * 7 + 6))
        const weekEnd = new Date(now)
        weekEnd.setDate(weekEnd.getDate() - i * 7)

        const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${
          weekEnd.getMonth() + 1
        }`

        const weekFlashcards = flashcards.filter(
          (card) =>
            card.lastReviewed && card.lastReviewed >= weekStart.getTime() && card.lastReviewed <= weekEnd.getTime(),
        )

        const correct = weekFlashcards.reduce((acc, card) => acc + card.correctCount, 0)
        const incorrect = weekFlashcards.reduce((acc, card) => acc + card.incorrectCount, 0)

        data.push({
          name: `Week ${4 - i}`,
          correct,
          incorrect,
          tooltip: weekLabel,
        })
      }
    }

    return data
  }

  const sessionData = processSessionData()
  const flashcardData = processFlashcardData()

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as "weekly" | "monthly")}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sessions: {
                label: "Sessions",
                color: "hsl(var(--chart-1))",
              },
              messages: {
                label: "Messages",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, name === "sessions" ? "Sessions" : "Messages"]}
                  labelFormatter={(label, items) => {
                    const item = items[0]?.payload
                    return item?.tooltip || label
                  }}
                />
                <Bar dataKey="sessions" fill="var(--color-sessions)" name="Sessions" />
                <Bar dataKey="messages" fill="var(--color-messages)" name="Messages" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flashcard Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              correct: {
                label: "Correct",
                color: "hsl(142, 76%, 36%)",
              },
              incorrect: {
                label: "Incorrect",
                color: "hsl(346, 84%, 61%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flashcardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, name === "correct" ? "Correct" : "Incorrect"]}
                  labelFormatter={(label, items) => {
                    const item = items[0]?.payload
                    return item?.tooltip || label
                  }}
                />
                <Line type="monotone" dataKey="correct" stroke="var(--color-correct)" name="Correct" />
                <Line type="monotone" dataKey="incorrect" stroke="var(--color-incorrect)" name="Incorrect" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
