"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { FlashcardStack } from "@/components/flashcards/flashcard-stack"
import { FlashcardList } from "@/components/flashcards/flashcard-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, List, Layers } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"

export function FlashcardsView() {
  const { flashcards } = useStore()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("stack")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AppLayout>
      <div className="container max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground">
              {flashcards.length} {flashcards.length === 1 ? "card" : "cards"} in your collection
            </p>
          </div>
          <Link href="/flashcards/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Button>
          </Link>
        </div>

        {flashcards.length > 0 ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stack" className="gap-2">
                <Layers className="h-4 w-4" />
                <span>Stack</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stack" className="mt-6">
              <FlashcardStack flashcards={flashcards} />
            </TabsContent>
            <TabsContent value="list" className="mt-6">
              <FlashcardList flashcards={flashcards} />
            </TabsContent>
          </Tabs>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center"
          >
            <Layers className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-medium">No flashcards yet</h2>
            <p className="mb-6 text-muted-foreground">Create your first flashcard to start learning</p>
            <Link href="/flashcards/create">
              <Button>Create Flashcard</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}
