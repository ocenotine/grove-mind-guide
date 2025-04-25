"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { DocumentList } from "@/components/documents/document-list"
import { DocumentUpload } from "@/components/documents/document-upload"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"

export function DocumentsView() {
  const { documents } = useStore()
  const [mounted, setMounted] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AppLayout>
      <div className="container max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-muted-foreground">
              {documents.length} {documents.length === 1 ? "document" : "documents"} in your library
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowUpload(true)}>
            <Plus className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </div>

        {showUpload && <DocumentUpload onClose={() => setShowUpload(false)} />}

        {documents.length > 0 ? (
          <DocumentList documents={documents} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center"
          >
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-medium">No documents yet</h2>
            <p className="mb-6 text-muted-foreground">Upload documents to analyze and create flashcards</p>
            <Button onClick={() => setShowUpload(true)}>Upload Document</Button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}
