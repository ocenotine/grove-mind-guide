"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import { generateBrainExercise } from "@/lib/api"
import { Brain, Loader2, CheckCircle, Clock, Zap, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { Separator } from "@/components/ui/separator"

export function BrainBoostView() {
  const { user, chatSessions, setUser } = useStore()
  const [recentConcepts, setRecentConcepts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [exercise, setExercise] = useState<any>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [userProgress, setUserProgress] = useState(0)
  const [dailyStreak, setDailyStreak] = useState(() => {
    // Get streak from localStorage
    if (typeof window !== "undefined") {
      const storedStreak = localStorage.getItem("brain-boost-streak")
      return storedStreak ? Number.parseInt(storedStreak, 10) : 0
    }
    return 0
  })
  const [lastCompletionDate, setLastCompletionDate] = useState(() => {
    // Get last completion date from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("brain-boost-last-completion") || ""
    }
    return ""
  })

  // Extract concepts from chat sessions
  useEffect(() => {
    const extractConcepts = () => {
      // Default concepts if no chat sessions exist
      if (!chatSessions || chatSessions.length === 0) {
        return ["learning", "memory", "focus", "cognition"]
      }

      // Get the most recent chat sessions (up to 3)
      const recentSessions = [...chatSessions].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3)

      // Extract potential concepts from messages
      const conceptSet = new Set<string>()
      recentSessions.forEach((session) => {
        session.messages.forEach((msg) => {
          if (msg.role === "assistant") {
            // Extract nouns and key terms from messages
            const words = msg.content.split(/\s+/)
            words.forEach((word) => {
              // Simple filtering for potential concept words (longer than 4 chars, not common words)
              if (word.length > 4 && !commonWords.includes(word.toLowerCase())) {
                conceptSet.add(word.toLowerCase())
              }
            })
          }
        })
      })

      // Convert set to array and take up to 10 concepts
      const extractedConcepts = Array.from(conceptSet).slice(0, 10)

      // If we couldn't extract enough concepts, add some defaults
      if (extractedConcepts.length < 4) {
        return [...extractedConcepts, "learning", "memory", "focus", "cognition"].slice(0, 10)
      }

      return extractedConcepts
    }

    // Common words to filter out
    const commonWords = [
      "about",
      "after",
      "again",
      "also",
      "always",
      "another",
      "because",
      "before",
      "between",
      "both",
      "could",
      "every",
      "from",
      "have",
      "their",
      "there",
      "these",
      "thing",
      "think",
      "this",
      "those",
      "through",
      "what",
      "when",
      "where",
      "which",
      "while",
      "with",
      "would",
      "your",
    ]

    setRecentConcepts(extractConcepts())
  }, [chatSessions])

  // Check if exercise was completed today
  useEffect(() => {
    const today = new Date().toDateString()
    if (lastCompletionDate === today) {
      setIsCompleted(true)
    }
  }, [lastCompletionDate])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false)
      if (interval) clearInterval(interval)

      // Complete exercise
      completeExercise()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining])

  const generateExercise = async () => {
    setIsLoading(true)

    try {
      const concepts =
        recentConcepts && recentConcepts.length > 0 ? recentConcepts : ["learning", "memory", "focus", "cognition"]

      if (concepts) {
        const exercise = await generateBrainExercise(concepts)

        if (exercise) {
          setExercise(exercise)
          // Set timer based on exercise type
          if (exercise.type === "memory") {
            setTimeRemaining(120) // 2 minutes
          } else if (exercise.type === "focus") {
            setTimeRemaining(180) // 3 minutes
          } else {
            setTimeRemaining(150) // 2.5 minutes
          }
        }
      }
    } catch (error) {
      console.error("Error generating brain exercise:", error)
      toast({
        title: "Error",
        description: "Failed to generate a brain exercise. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startExercise = () => {
    setIsActive(true)
    setUserProgress(0)
  }

  const updateProgress = (increment = 10) => {
    setUserProgress((prev) => Math.min(prev + increment, 100))
  }

  const completeExercise = () => {
    const today = new Date().toDateString()

    // Check if this is the first completion today
    if (lastCompletionDate !== today) {
      // Update streak
      const newStreak = dailyStreak + 1
      setDailyStreak(newStreak)

      // Save to localStorage
      localStorage.setItem("brain-boost-streak", newStreak.toString())
      localStorage.setItem("brain-boost-last-completion", today)

      // Update state
      setLastCompletionDate(today)

      // Award XP
      const xpEarned = 50 + newStreak * 5

      // Update user XP using setUser
      if (user) {
        setUser({
          xp: (user.xp || 0) + xpEarned,
        })
      }

      toast({
        title: "Brain Boost Completed!",
        description: `You earned ${xpEarned} XP and maintained a ${newStreak} day streak!`,
      })
    }

    setIsCompleted(true)
    setIsActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <AppLayout>
      <div className="container max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Brain Boost Mode</h1>
          <p className="text-muted-foreground">Daily exercises to improve focus and cognitive abilities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{exercise?.title || "Brain Exercise"}</CardTitle>
                    <CardDescription>
                      {exercise?.type
                        ? `${exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)} exercise`
                        : "Complete daily exercises to boost your cognitive abilities"}
                    </CardDescription>
                  </div>
                  {isActive && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(timeRemaining)}</span>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Generating your daily brain exercise...</p>
                  </div>
                ) : exercise ? (
                  <div className="space-y-6">
                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="mb-2 font-medium">Instructions:</h3>
                      <p>{exercise.instructions}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Exercise:</h3>
                      <div className="whitespace-pre-wrap">{exercise.content}</div>
                    </div>

                    {isActive && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{userProgress}%</span>
                        </div>
                        <Progress value={userProgress} className="h-2" />
                        <div className="flex justify-center pt-4">
                          <Button onClick={() => updateProgress()} disabled={userProgress >= 100}>
                            Mark Progress
                          </Button>
                        </div>
                      </div>
                    )}

                    {isCompleted && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-primary/10 p-4 text-center"
                      >
                        <CheckCircle className="mx-auto mb-2 h-8 w-8 text-primary" />
                        <h3 className="text-lg font-medium">Exercise Completed!</h3>
                        <p className="text-sm text-muted-foreground">
                          You've completed your brain boost exercise for today.
                        </p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No exercise available. Generate a new exercise to start!</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                {!exercise && !isLoading && (
                  <Button onClick={generateExercise}>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Exercise
                  </Button>
                )}
                {exercise && !isActive && !isCompleted && (
                  <Button onClick={startExercise}>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Exercise
                  </Button>
                )}
                {exercise && isActive && userProgress >= 100 && (
                  <Button onClick={completeExercise}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Exercise
                  </Button>
                )}
                {isCompleted && (
                  <Button variant="outline" disabled>
                    Completed Today
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute inset-0 rounded-full bg-orange-500/20"
                    ></motion.div>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-white">
                      <span className="text-3xl font-bold">{dailyStreak}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    {dailyStreak === 0
                      ? "Start your streak today!"
                      : dailyStreak === 1
                        ? "1 day streak! Keep it up!"
                        : `${dailyStreak} day streak! Impressive!`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm">Improved focus and concentration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm">Enhanced memory retention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">Daily XP rewards</span>
                  </li>
                </ul>

                <Separator className="my-4" />

                <div className="text-center text-sm text-muted-foreground">
                  Complete daily exercises to maintain your streak and earn bonus XP!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
