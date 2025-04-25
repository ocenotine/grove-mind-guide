"use client"

import type { Document } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FileImage, FileArchive, File, Trash2, MessageSquare, BookOpen } from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
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
import { useState } from "react"
import { motion } from "framer-motion"

interface DocumentListProps {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { deleteDocument } = useStore()
  const router = useRouter()

  const handleDelete = () => {
    if (deleteId) {
      deleteDocument(deleteId)
      setDeleteId(null)
    }
  }

  // Get icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-6 w-6" />
      case "image":
        return <FileImage className="h-6 w-6" />
      case "archive":
        return <FileArchive className="h-6 w-6" />
      default:
        return <File className="h-6 w-6" />
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  {getDocumentIcon(doc.type)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="truncate font-medium">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  {doc.concepts.slice(0, 3).map((concept, i) => (
                    <span key={i} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {concept}
                    </span>
                  ))}
                  {doc.concepts.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">+{doc.concepts.length - 3} more</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push(`/chat?document=${encodeURIComponent(doc.id)}`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => router.push(`/flashcards/create?document=${encodeURIComponent(doc.id)}`)}
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteId(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
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
