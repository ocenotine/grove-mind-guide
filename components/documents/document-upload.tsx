"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, X, Loader2, Check, AlertCircle, BookOpen } from "lucide-react"
import { useStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"
import { processPdfFile, summarizeDocument, generateFlashcards, extractConcepts } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

interface DocumentUploadProps {
  onClose: () => void
}

export function DocumentUpload({ onClose }: DocumentUploadProps) {
  const { addDocument, addFlashcard } = useStore()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "processing" | "summarizing" | "extracting" | "generating" | "success" | "error"
  >("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [documentText, setDocumentText] = useState("")
  const [documentSummary, setDocumentSummary] = useState("")
  const [documentConcepts, setDocumentConcepts] = useState<string[]>([])
  const [generatedFlashcards, setGeneratedFlashcards] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file type
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase()
      if (fileType !== "pdf" && fileType !== "txt" && fileType !== "doc" && fileType !== "docx") {
        setErrorMessage("Only PDF, TXT, DOC, and DOCX files are supported")
        return
      }

      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB")
        return
      }

      setFile(selectedFile)
      setErrorMessage("")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("processing")
    setUploadProgress(10)

    try {
      // Process file (extract text)
      let text = ""
      if (file.type === "application/pdf") {
        text = await processPdfFile(file)
      } else if (file.type === "text/plain") {
        text = await file.text()
      } else {
        // Mock text extraction for doc/docx (you would need a library for real extraction)
        text = `Content from ${file.name} (mock extraction for demo purposes).`
      }

      setDocumentText(text)
      setUploadProgress(30)

      // Summarize content
      setUploadStatus("summarizing")
      const summary = await summarizeDocument(text.slice(0, 10000)) // Limit text size
      setDocumentSummary(summary)
      setUploadProgress(50)

      // Extract concepts
      setUploadStatus("extracting")
      const concepts = await extractConcepts(text.slice(0, 5000))
      setDocumentConcepts(concepts)
      setUploadProgress(70)

      // Generate flashcards
      setUploadStatus("generating")
      const flashcards = await generateFlashcards(text.slice(0, 5000))
      setGeneratedFlashcards(flashcards)
      setUploadProgress(90)

      // Get file extension
      const fileType = file.name.split(".").pop()?.toLowerCase() || ""

      // Add document to store
      const documentId = addDocument({
        id: uuidv4(),
        title: file.name,
        type: fileType,
        url: URL.createObjectURL(file),
        concepts,
        summary,
        tags: concepts,
      })

      // Add flashcards to store
      if (flashcards && flashcards.length > 0) {
        flashcards.forEach((flashcard) => {
          addFlashcard({
            front: flashcard.question,
            back: flashcard.answer,
            tags: flashcard.tags || concepts.slice(0, 3),
          })
        })

        toast({
          title: "Flashcards Created",
          description: `${flashcards.length} flashcards were generated from your document.`,
        })
      }

      setUploadProgress(100)
      setUploadStatus("success")

      // Close upload form after success
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error("Error uploading document:", error)
      setUploadStatus("error")
      setErrorMessage(error.message || "Failed to upload document. Please try again.")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const viewGeneratedFlashcards = () => {
    router.push("/flashcards")
    onClose()
  }

  const getProgressLabel = () => {
    switch (uploadStatus) {
      case "processing":
        return "Processing document..."
      case "summarizing":
        return "Summarizing content..."
      case "extracting":
        return "Extracting concepts..."
      case "generating":
        return "Generating flashcards..."
      case "success":
        return "Upload complete!"
      default:
        return "Uploading..."
    }
  }

  return (
    <Card className="mx-auto mb-6 max-w-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Upload Document</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isUploading}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploadStatus === "idle" && (
            <div className="space-y-2">
              <Label htmlFor="file">Select a file</Label>
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/50 hover:bg-muted"
                onClick={triggerFileInput}
              >
                <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{file ? file.name : "Click to select a file"}</p>
                {file && <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
              </div>
              {errorMessage && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Supported file types: PDF, TXT, DOC, DOCX (max 10MB)</p>
            </div>
          )}

          {uploadStatus !== "idle" && uploadStatus !== "success" && uploadStatus !== "error" && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
                <h3 className="mb-1 text-lg font-medium">{getProgressLabel()}</h3>
                <p className="mb-4 text-sm text-muted-foreground">Please wait while we process your document...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center">
                <Check className="mb-4 h-8 w-8 text-green-500" />
                <h3 className="mb-1 text-lg font-medium">Upload Complete!</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Your document has been processed and {generatedFlashcards.length} flashcards have been created.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2" onClick={viewGeneratedFlashcards}>
                    <BookOpen className="h-4 w-4" />
                    <span>View Flashcards</span>
                  </Button>
                  <Button onClick={onClose}>Done</Button>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center">
                <AlertCircle className="mb-4 h-8 w-8 text-destructive" />
                <h3 className="mb-1 text-lg font-medium">Upload Failed</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">{errorMessage}</p>
                <Button variant="outline" onClick={() => setUploadStatus("idle")}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {uploadStatus === "idle" && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            <FileUp className="mr-2 h-4 w-4" />
            <span>Upload</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
