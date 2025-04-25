"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"

export function RecentFlashcards() {
  const { flashcards } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const recentCards = flashcards.slice(0, 3)

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Flashcards</CardTitle>
        <Link href="/flashcards/create">
          <Button size="sm" variant="ghost" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentCards.length > 0 ? (
          <div className="grid gap-4">
            {recentCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flashcard relative h-24 w-full cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                onClick={() => {}}
              >
                <div className="flashcard-inner">
                  <div className="flashcard-front absolute inset-0 flex items-center justify-center p-4">
                    <p className="text-center">{card.question}</p>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <div className="flex gap-1">
                    {card.tags.map((tag, i) => (
                      <span key={i} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-muted-foreground">No flashcards yet</p>
            <Link href="/flashcards/create">
              <Button>Create your first flashcard</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
