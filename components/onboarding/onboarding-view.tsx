"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Book, Brain, BarChart, Check } from "lucide-react"
import Image from "next/image"

export function OnboardingView() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [customSubject, setCustomSubject] = useState("")
  const [otherInterest, setOtherInterest] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser, setOnboarded } = useStore()

  // Default subjects list
  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Literature",
    "Art",
    "Music",
    "Philosophy",
    "Psychology",
    "Economics",
  ]

  const router = useRouter()

  // Check if onboarding is already completed
  useEffect(() => {
    const storedSettings = localStorage.getItem("mindgrove-storage")
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings)
        if (parsed.state?.isOnboarded) {
          router.push("/dashboard")
        }
      } catch (e) {
        console.error("Error parsing stored settings", e)
      }
    }
  }, [router])

  const handleNext = () => {
    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      // Validate that at least one subject is selected
      if (selectedSubjects.length === 0 && !customSubject) {
        alert("Please select at least one subject or add a custom subject")
        return
      }
      setStep(2)
    } else if (step === 2) {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSubjectToggle = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
    } else {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  const handleAddCustomSubject = () => {
    if (customSubject.trim()) {
      setSelectedSubjects([...selectedSubjects, customSubject.trim()])
      setCustomSubject("")
    }
  }

  const handleAddOtherInterest = () => {
    if (otherInterest.trim()) {
      setSelectedSubjects([...selectedSubjects, otherInterest.trim()])
      setOtherInterest("")
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)

    try {
      // Update user settings using setUser function
      setUser({
        name: name || "User",
        interests: selectedSubjects,
      })

      // Mark onboarding as completed
      setOnboarded(true)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step > 0 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {step === 0 && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full bg-primary/10">
                      <Image src="/logo.png" alt="Mindgrove Logo" width={96} height={96} className="object-contain" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Welcome to Mindgrove</h1>
                    <p className="text-muted-foreground">Your personal AI-powered tutor and research assistant</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">What should we call you?</Label>
                      <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Select Your Interests</h1>
                    <p className="text-muted-foreground">Choose subjects you want to learn about</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject}
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <Label htmlFor={subject} className="cursor-pointer">
                          {subject}
                        </Label>
                      </div>
                    ))}
                    <div className="col-span-2 flex items-center space-x-2">
                      <Checkbox
                        id="other"
                        checked={false}
                        onCheckedChange={() => {
                          document.getElementById("otherInterest")?.focus()
                        }}
                      />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other:
                      </Label>
                      <Input
                        id="otherInterest"
                        className="ml-2 h-8 flex-1"
                        placeholder="Specify interest"
                        value={otherInterest}
                        onChange={(e) => setOtherInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddOtherInterest()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddOtherInterest}
                        disabled={!otherInterest.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customSubject">Add a custom subject</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="customSubject"
                        placeholder="E.g., Quantum Physics"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddCustomSubject()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddCustomSubject}
                        disabled={!customSubject.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  {selectedSubjects.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected subjects:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubjects.map((subject) => (
                          <div
                            key={subject}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                          >
                            {subject}
                            <button
                              type="button"
                              className="ml-1 rounded-full p-1 hover:bg-primary/20"
                              onClick={() => handleSubjectToggle(subject)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">You're All Set!</h1>
                    <p className="text-muted-foreground">Here's what you can do with Mindgrove</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 rounded-lg border p-3">
                      <Brain className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Learn with AI</h3>
                        <p className="text-sm text-muted-foreground">
                          Chat with your AI tutor to learn new concepts and get instant answers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 rounded-lg border p-3">
                      <Book className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Create Flashcards</h3>
                        <p className="text-sm text-muted-foreground">
                          Generate and review flashcards to reinforce your learning
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 rounded-lg border p-3">
                      <BarChart className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Track Progress</h3>
                        <p className="text-sm text-muted-foreground">
                          Monitor your learning journey with detailed insights and statistics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between border-t p-4">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 0 || isSubmitting}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === step ? "bg-primary" : "bg-primary/20"}`} />
              ))}
            </div>
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting || (step === 1 && selectedSubjects.length === 0)}
            >
              {step === 2 ? (
                <>
                  {isSubmitting ? "Setting up..." : "Get Started"}
                  {isSubmitting ? null : <Check className="ml-2 h-4 w-4" />}
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
