"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BookOpen, Flame, Award, BarChart2 } from "lucide-react"

interface ProgressStatsProps {
  sessions: number
  messages: number
  flashcards: number
  streak: number
  challenges: number
}

export function ProgressStats({ sessions, messages, flashcards, streak, challenges }: ProgressStatsProps) {
  const stats = [
    {
      title: "Learning Sessions",
      value: sessions,
      description: "Total chat sessions",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      title: "Questions Asked",
      value: Math.floor(messages / 2), // Approximate user messages
      description: "Total questions asked",
      icon: BarChart2,
      color: "text-purple-500",
    },
    {
      title: "Flashcards",
      value: flashcards,
      description: "Created flashcards",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: "Current Streak",
      value: streak,
      description: "Days in a row",
      icon: Flame,
      color: "text-orange-500",
    },
    {
      title: "Challenges",
      value: challenges,
      description: "Completed challenges",
      icon: Award,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <stat.icon className={`mr-1 h-4 w-4 ${stat.color}`} />
              {stat.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{stat.value}</CardTitle>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
