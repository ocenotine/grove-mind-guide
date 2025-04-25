"use client"

import { useState, useRef } from "react"
import type { Flashcard } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCw, ThumbsUp, ThumbsDown } from "lucide-react"
import { useStore } from "@/lib/store"
import { motion, type PanInfo, useAnimation } from "framer-motion"

interface FlashcardStackProps {
  flashcards: Flashcard[]
}

export function FlashcardStack({ flashcards }: FlashcardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const controls = useAnimation()
  const { updateFlashcard } = useStore()
  const constraintsRef = useRef(null)

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      // Swiped right - correct
      handleSwipe("right")
    } else if (info.offset.x < -threshold) {
      // Swiped left - incorrect
      handleSwipe("left")
    } else {
      // Reset position
      controls.start({ x: 0, rotate: 0 })
    }
  }

  const handleSwipe = (dir: "left" | "right") => {
    setDirection(dir)

    // Update flashcard stats
    if (currentIndex < flashcards.length) {
      const card = flashcards[currentIndex]
      if (dir === "right") {
        updateFlashcard(card.id, { correctCount: card.correctCount + 1, lastReviewed: Date.now() })
      } else {
        updateFlashcard(card.id, { incorrectCount: card.incorrectCount + 1, lastReviewed: Date.now() })
      }
    }

    // Animate card off screen
    controls.start({
      x: dir === "right" ? 1000 : -1000,
      rotate: dir === "right" ? 20 : -20,
      transition: { duration: 0.5 },
    })

    // Move to next card after animation
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Reset to first card when we reach the end
        setCurrentIndex(0)
      }
      setFlipped(false)
      setDirection(null)
      controls.set({ x: 0, rotate: 0 })
    }, 500)
  }

  if (flashcards.length === 0) {
    return <div className="text-center">No flashcards available</div>
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="relative h-[400px]" ref={constraintsRef}>
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="absolute left-0 top-0 h-full w-full"
        style={{ touchAction: "none" }}
      >
        <Card className={`flashcard h-full w-full cursor-pointer ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
          <div className="flashcard-inner relative h-full w-full">
            <div className="flashcard-front absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="mb-4 text-xs text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
              </div>
              <h3 className="mb-6 text-center text-xl font-medium">{currentCard.question}</h3>
              <div className="mt-auto text-center text-sm text-muted-foreground">Tap to flip</div>
            </div>
            <div className="flashcard-back absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="mb-4 text-xs text-muted-foreground">Answer</div>
              <p className="mb-6 text-center">{currentCard.answer}</p>
              <div className="mt-auto text-center text-sm text-muted-foreground">Tap to flip back</div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="absolute bottom-4 left-0 flex w-full justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-destructive text-destructive-foreground"
          onClick={() => handleSwipe("left")}
        >
          <ThumbsDown className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => {
            setFlipped(false)
            if (currentIndex < flashcards.length - 1) {
              setCurrentIndex(currentIndex + 1)
            } else {
              setCurrentIndex(0)
            }
          }}
        >
          <RotateCw className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground"
          onClick={() => handleSwipe("right")}
        >
          <ThumbsUp className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
