"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash, RotateCw, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Flashcard } from "@/lib/types"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface FlashcardsListProps {
  flashcards: Flashcard[]
}

export function FlashcardsList({ flashcards }: FlashcardsListProps) {
  const { deleteFlashcard } = useStore()
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({})

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleDeleteFlashcard = (id: string) => {
    deleteFlashcard(id)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id} className="overflow-hidden">
          <div
            className={cn("flashcard cursor-pointer", flippedCards[flashcard.id] && "flipped")}
            onClick={() => toggleFlip(flashcard.id)}
          >
            <div className="flashcard-inner h-48">
              <CardContent className="flashcard-front flex h-full items-center justify-center p-6">
                <p className="text-center">{flashcard.front}</p>
              </CardContent>
              <CardContent className="flashcard-back flex h-full items-center justify-center p-6">
                <p className="text-center">{flashcard.back}</p>
              </CardContent>
            </div>
          </div>
          <CardFooter className="flex justify-between border-t p-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFlip(flashcard.id)
                }}
              >
                <RotateCw className="h-4 w-4" />
                <span className="sr-only">Flip</span>
              </Button>
              {flashcard.tags.length > 0 && (
                <div className="ml-2 flex items-center">
                  <Tag className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {flashcard.tags[0]}
                    {flashcard.tags.length > 1 && ` +${flashcard.tags.length - 1}`}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Link href={`/flashcards/edit/${flashcard.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this flashcard? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFlashcard(flashcard.id)
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
