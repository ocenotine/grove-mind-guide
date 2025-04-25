"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, RotateCw, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Flashcard } from "@/lib/types"

interface FlashcardsSwipeProps {
  flashcards: Flashcard[]
}

export function FlashcardsSwiper({ flashcards }: FlashcardsSwipeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  useEffect(() => {
    // Reset flip state when changing cards
    setIsFlipped(false)
  }, [currentIndex])

  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => {
        setSwipeDirection(null)
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          // Reset to first card when we reach the end
          setCurrentIndex(0)
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [swipeDirection, currentIndex, flashcards.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)

    if (touchStart && touchEnd && cardRef.current) {
      const distance = touchStart - touchEnd
      const translateX = -distance

      // Apply transform only during the swipe
      if (Math.abs(distance) < 200) {
        cardRef.current.style.transform = `translateX(${translateX}px) rotate(${translateX * 0.05}deg)`
      }
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd

    if (cardRef.current) {
      // Reset transform
      cardRef.current.style.transform = ""
    }

    if (distance > minSwipeDistance) {
      // Swiped left
      handleSwipe("left")
    } else if (distance < -minSwipeDistance) {
      // Swiped right
      handleSwipe("right")
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const goToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      // Loop to the last card
      setCurrentIndex(flashcards.length - 1)
    }
  }

  const goToNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop to the first card
      setCurrentIndex(0)
    }
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    )
  }

  const currentFlashcard = flashcards[currentIndex]

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center text-sm text-muted-foreground">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div
        className="relative h-64 w-full max-w-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={cardRef}
          className={cn(
            "swipe-card flashcard",
            isFlipped && "flipped",
            swipeDirection === "left" && "swiped-left",
            swipeDirection === "right" && "swiped-right",
          )}
        >
          <Card className="h-full w-full">
            <div className="flashcard-inner h-full">
              <CardContent className="flashcard-front flex h-full items-center justify-center p-6">
                <p className="text-center text-lg">{currentFlashcard.front}</p>
              </CardContent>
              <CardContent className="flashcard-back flex h-full items-center justify-center p-6">
                <p className="text-center text-lg">{currentFlashcard.back}</p>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={goToPrevCard}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>

        <Button variant="outline" size="icon" onClick={toggleFlip}>
          <RotateCw className="h-4 w-4" />
          <span className="sr-only">Flip</span>
        </Button>

        <Button variant="outline" size="icon" onClick={goToNextCard}>
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <Button variant="outline" className="gap-2" onClick={() => handleSwipe("left")}>
          <ThumbsDown className="h-4 w-4" />
          <span>Difficult</span>
        </Button>

        <Button variant="outline" className="gap-2" onClick={() => handleSwipe("right")}>
          <ThumbsUp className="h-4 w-4" />
          <span>Easy</span>
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">Swipe left if difficult, right if easy</p>
    </div>
  )
}
