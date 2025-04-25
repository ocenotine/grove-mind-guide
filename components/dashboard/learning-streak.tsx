"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store"

export function LearningStreak() {
  const { user, setUser } = useStore()
  const [animate, setAnimate] = useState(false)
  const streak = user.streak || 0

  useEffect(() => {
    // Check if user visited today already
    const today = new Date().toDateString()
    const lastActive = localStorage.getItem("last-active-date")

    if (lastActive !== today) {
      // Update last active
      localStorage.setItem("last-active-date", today)

      // Increment streak if this is a new day
      const newStreak = streak + 1
      setUser({
        ...user,
        streak: newStreak,
        lastActive: Date.now(),
      })
    }

    // Animate the flame when component mounts
    setAnimate(true)

    // Set up interval to animate the flame periodically
    const interval = setInterval(() => {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 2000)
    }, 5000)

    return () => clearInterval(interval)
  }, [streak, user, setUser])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Learning Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-4">
          <AnimatePresence>
            <motion.div
              key="streak-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className={`streak-flame ${animate ? "active" : ""}`}
                animate={
                  animate
                    ? {
                        scale: [1, 1.1, 1],
                        filter: [
                          "drop-shadow(0 0 8px rgba(255, 165, 0, 0.5))",
                          "drop-shadow(0 0 12px rgba(255, 165, 0, 0.8))",
                          "drop-shadow(0 0 8px rgba(255, 165, 0, 0.5))",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: 0 }}
              >
                <Flame size={64} className={`${streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-center"
              >
                <div className="text-3xl font-bold">{streak}</div>
                <div className="text-sm text-muted-foreground">{streak === 1 ? "day" : "days"}</div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          {streak === 0
            ? "Start your learning journey today!"
            : streak < 3
              ? "Keep going! You're building momentum."
              : streak < 7
                ? "Great consistency! You're making progress."
                : "Impressive dedication! Knowledge compounds daily."}
        </div>
      </CardContent>
    </Card>
  )
}
