"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface StreakCalendarProps {
  streak: number
  completedChallenges: string[]
}

export function StreakCalendar({ streak, completedChallenges }: StreakCalendarProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Generate calendar data for the current month
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get the first day of the month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  // Get the number of days in the month
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Generate the days array
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Add the days of the month
  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(currentYear, currentMonth, i)
    const dateString = date.toDateString()
    const isToday = i === today.getDate()
    const isActive = completedChallenges.includes(dateString)

    days.push({ day: i, isToday, isActive })
  }

  // Get month name
  const monthName = today.toLocaleString("default", { month: "long" })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {monthName} {currentYear}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>Active</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-secondary"></div>
            <span>Inactive</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-full text-sm",
                  day.isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  day.isToday && "ring-2 ring-primary ring-offset-2",
                )}
              >
                {day.day}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{streak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
          {streak > 0 && <span className="text-xl">🔥</span>}
        </div>
      </div>
    </div>
  )
}
