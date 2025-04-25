"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"
import { AlertCircle, Check, HelpCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export function DailyChallenge() {
  const { dailyChallenge, completeDailyChallenge, resetDailyChallenge } = useStore()
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Reset daily challenge if needed
    resetDailyChallenge()
  }, [resetDailyChallenge])

  useEffect(() => {
    if (dailyChallenge) {
      setSubmitted(dailyChallenge.completed)
      if (dailyChallenge.userAnswer) {
        setSelectedAnswer(dailyChallenge.userAnswer)
      }
    }
  }, [dailyChallenge])

  if (!mounted || !dailyChallenge) return null

  const handleSubmit = () => {
    if (!selectedAnswer) return
    completeDailyChallenge(selectedAnswer)
    setSubmitted(true)
  }

  const handleReset = () => {
    // Generate a new challenge
    resetDailyChallenge()
    // Reset local state
    setSelectedAnswer("")
    setSubmitted(false)
  }

  const isCorrect = submitted && selectedAnswer === dailyChallenge.answer

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Challenge</span>
          {submitted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full",
                isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
              )}
            >
              {isCorrect ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </motion.div>
          )}
        </CardTitle>
        <CardDescription>Test your knowledge with a daily question</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-medium">{dailyChallenge.question}</p>
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={submitted}
            className="space-y-2"
          >
            {dailyChallenge.options.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3 transition-colors",
                  submitted && option === dailyChallenge.answer
                    ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                    : submitted && option === selectedAnswer && option !== dailyChallenge.answer
                      ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                      : "hover:bg-muted/50",
                )}
              >
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="w-full cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md bg-muted p-3"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Explanation</p>
                  <p className="text-sm text-muted-foreground">{dailyChallenge.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {submitted ? (
          <Button onClick={handleReset} className="w-full" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Another Question
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full">
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
