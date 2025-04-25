"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function MiniGameCenter() {
  const { miniGames, updateMiniGameScore } = useStore()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [gameState, setGameState] = useState<"select" | "playing" | "results">("select")
  const [currentGame, setCurrentGame] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [score, setScore] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedGame) {
      const game = miniGames.find((g) => g.id === selectedGame)
      setCurrentGame(game)
      setAnswers({})
    }
  }, [selectedGame, miniGames])

  if (!mounted) return null

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId)
    setGameState("playing")
  }

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmit = () => {
    if (!currentGame) return

    // Check if all questions are answered
    const allAnswered = currentGame.questions.every((q: any) => answers[q.id])
    if (!allAnswered) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      })
      return
    }

    // Calculate score
    let correctCount = 0
    currentGame.questions.forEach((q: any) => {
      const userAnswer = answers[q.id]
      let isCorrect = false

      if (currentGame.type === "quiz") {
        isCorrect = q.answer === userAnswer
      } else if (currentGame.type === "matching") {
        isCorrect = q.answer === userAnswer
      } else if (currentGame.type === "fillBlanks") {
        isCorrect = q.answer.toLowerCase() === (userAnswer as string).toLowerCase()
      }

      if (isCorrect) correctCount++
    })

    const finalScore = Math.round((correctCount / currentGame.questions.length) * 100)
    setScore(finalScore)
    updateMiniGameScore(currentGame.id, finalScore, answers)
    setGameState("results")
  }

  const handlePlayAgain = () => {
    setGameState("select")
    setSelectedGame(null)
    setCurrentGame(null)
    setAnswers({})
    setScore(0)
  }

  const renderGameSelection = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {miniGames.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>Topic: {game.topic}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                {game.type === "quiz"
                  ? "Multiple choice questions"
                  : game.type === "matching"
                    ? "Match concepts with definitions"
                    : "Fill in the blanks"}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">{game.questions.length}</span> questions
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSelectGame(game.id)} className="w-full">
                Play Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const renderQuizGame = () => {
    if (!currentGame) return null

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{currentGame.title}</CardTitle>
            <CardDescription>Select the correct answer for each question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentGame.questions.map((question: any, index: number) => (
              <div key={question.id} className="space-y-3">
                <h3 className="font-medium">
                  {index + 1}. {question.question}
                </h3>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                >
                  {question.options?.map((option: string) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              Submit Answers
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderMatchingGame = () => {
    if (!currentGame) return null

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{currentGame.title}</CardTitle>
            <CardDescription>Match each concept with its correct definition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentGame.questions.map((question: any, index: number) => (
              <div key={question.id} className="space-y-2">
                <h3 className="font-medium">
                  {index + 1}. {question.question}
                </h3>
                <Input
                  placeholder="Enter the matching definition"
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              Submit Answers
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderFillBlanksGame = () => {
    if (!currentGame) return null

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{currentGame.title}</CardTitle>
            <CardDescription>Fill in the blanks with the correct answers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentGame.questions.map((question: any, index: number) => (
              <div key={question.id} className="space-y-2">
                <h3 className="font-medium">
                  {index + 1}. {question.question}
                </h3>
                <Input
                  placeholder="Your answer"
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              Submit Answers
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderResults = () => {
    if (!currentGame) return null

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Results</CardTitle>
            <div className="mt-2 text-4xl font-bold">{score}%</div>
            <CardDescription className="mt-2">
              {score >= 80 ? "Great job!" : score >= 60 ? "Good effort!" : "Keep practicing!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentGame.questions.map((question: any, index: number) => {
              const userAnswer = answers[question.id]
              let isCorrect = false

              if (currentGame.type === "quiz") {
                isCorrect = question.answer === userAnswer
              } else if (currentGame.type === "matching") {
                isCorrect = question.answer === userAnswer
              } else if (currentGame.type === "fillBlanks") {
                isCorrect = question.answer.toLowerCase() === (userAnswer as string).toLowerCase()
              }

              return (
                <div
                  key={question.id}
                  className={cn(
                    "rounded-lg border p-3",
                    isCorrect
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {index + 1}. {question.question}
                      </p>
                      <div className="mt-1">
                        <p className="text-sm text-muted-foreground">Your answer: {userAnswer}</p>
                        {!isCorrect && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            Correct answer: {question.answer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={cn("rounded-full p-1", isCorrect ? "text-green-600" : "text-red-600")}>
                      {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
          <CardFooter>
            <Button onClick={handlePlayAgain} className="w-full">
              Play Another Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="container max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mini Game Center</h1>
          <p className="text-muted-foreground">Learn while having fun with these educational games</p>
        </div>

        {gameState === "select" ? (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="matching">Matching</TabsTrigger>
              <TabsTrigger value="fillBlanks">Fill Blanks</TabsTrigger>
            </TabsList>
            <TabsContent value="all">{renderGameSelection()}</TabsContent>
            <TabsContent value="quiz">
              {miniGames.filter((g) => g.type === "quiz").length > 0 ? (
                renderGameSelection()
              ) : (
                <Card className="p-8 text-center">
                  <p>No quiz games available</p>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="matching">
              {miniGames.filter((g) => g.type === "matching").length > 0 ? (
                renderGameSelection()
              ) : (
                <Card className="p-8 text-center">
                  <p>No matching games available</p>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="fillBlanks">
              {miniGames.filter((g) => g.type === "fillBlanks").length > 0 ? (
                renderGameSelection()
              ) : (
                <Card className="p-8 text-center">
                  <p>No fill-in-the-blanks games available</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : gameState === "playing" ? (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setGameState("select")}>
              ← Back to Games
            </Button>
            {currentGame?.type === "quiz" && renderQuizGame()}
            {currentGame?.type === "matching" && renderMatchingGame()}
            {currentGame?.type === "fillBlanks" && renderFillBlanksGame()}
          </div>
        ) : (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setGameState("select")}>
              ← Back to Games
            </Button>
            {renderResults()}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
