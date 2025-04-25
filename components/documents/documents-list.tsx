"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, BookOpen, Trash, MoreHorizontal } from "lucide-react"
import type { Document } from "@/lib/types"
import { useStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import Link from "next/link"

interface DocumentsListProps {
  documents: Document[]
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const { deleteDocument } = useStore()

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id)
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />
      case "txt":
        return <FileText className="h-10 w-10 text-blue-500" />
      default:
        return <FileText className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {documents.map((document) => (
        <Card key={document.id}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{document.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={{
                        pathname: "/chat",
                        query: {
                          prompt: `Summarize the document "${document.name}" that I uploaded.`,
                        },
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat about this document
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/flashcards/create">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Create flashcards
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete document
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this document? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteDocument(document.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {getDocumentIcon(document.type)}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {document.pages} {document.pages === 1 ? "page" : "pages"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Uploaded {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full gap-2">
              <Link
                href={{
                  pathname: "/chat",
                  query: {
                    prompt: `Summarize the document "${document.name}" that I uploaded.`,
                  },
                }}
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  Chat
                </Button>
              </Link>
              <Link href="/flashcards/create" className="flex-1">
                <Button variant="outline" className="w-full">
                  Flashcards
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
