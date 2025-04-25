"use client"

import { useState, useRef } from "react"
import type { Flashcard } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Star } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

interface FlashcardListProps {
  flashcards: Flashcard[]
}

export function FlashcardList({ flashcards }: FlashcardListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { deleteFlashcard, updateFlashcard } = useStore()
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  const handleDelete = () => {
    if (deleteId) {
      deleteFlashcard(deleteId)
      setDeleteId(null)

      // Trigger haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30])
      }

      toast({
        title: "Flashcard deleted",
        description: "The flashcard has been removed from your collection.",
      })
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))

    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    toast({
      title: favorites[id] ? "Removed from favorites" : "Added to favorites",
      description: favorites[id] ? "Flashcard removed from your favorites." : "Flashcard added to your favorites.",
    })
  }

  return (
    <div className="space-y-4">
      {flashcards.map((card, index) => (
        <SwipeableCard
          key={card.id}
          card={card}
          index={index}
          onDelete={() => setDeleteId(card.id)}
          onFavorite={() => toggleFavorite(card.id)}
          isFavorite={!!favorites[card.id]}
        />
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flashcard? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface SwipeableCardProps {
  card: Flashcard
  index: number
  onDelete: () => void
  onFavorite: () => void
  isFavorite: boolean
}

function SwipeableCard({ card, index, onDelete, onFavorite, isFavorite }: SwipeableCardProps) {
  const x = useMotionValue(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardWidth = useRef(0)
  const background = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(239, 68, 68, 0.2)", "rgba(0, 0, 0, 0)", "rgba(59, 130, 246, 0.2)"],
  )

  const handleDragStart = () => {
    if (cardRef.current) {
      cardWidth.current = cardRef.current.getBoundingClientRect().width
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardWidth.current * 0.4

    if (info.offset.x < -threshold) {
      // Swiped left - delete
      onDelete()
    } else if (info.offset.x > threshold) {
      // Swiped right - favorite
      onFavorite()
    }

    // Reset position
    x.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{ background }}
      className="relative overflow-hidden rounded-lg"
    >
      {/* Left action indicator */}
      <div className="absolute bottom-0 left-4 top-0 flex items-center justify-center">
        <div className="rounded-full bg-destructive/80 p-2 text-destructive-foreground">
          <Trash2 className="h-6 w-6" />
        </div>
      </div>

      {/* Right action indicator */}
      <div className="absolute bottom-0 right-4 top-0 flex items-center justify-center">
        <div className="rounded-full bg-primary/80 p-2 text-primary-foreground">
          <Star className="h-6 w-6" />
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="touch-none"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 border-b p-4 md:border-b-0 md:border-r">
                <div className="mb-1 text-xs text-muted-foreground">Question</div>
                <p>{card.question}</p>
              </div>
              <div className="flex-1 p-4">
                <div className="mb-1 text-xs text-muted-foreground">Answer</div>
                <p>{card.answer}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2">
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag, i) => (
                  <span key={i} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {tag}
                  </span>
                ))}
                {isFavorite && (
                  <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-500">Favorite</span>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/flashcards/edit/${card.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
