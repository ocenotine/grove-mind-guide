"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Share, BookmarkPlus, ArrowLeft, Search, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

export function ChatHeader() {
  const { chatSessions, currentSessionId, updateChatSession } = useStore()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const currentSession = chatSessions.find((session) => session.id === currentSessionId)

  // If there's no current session, show a minimal header
  if (!currentSession) {
    return (
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">New Chat</h1>
        <div className="w-9"></div> {/* Empty div for spacing */}
      </div>
    )
  }

  const handleTitleChange = () => {
    if (title.trim() && currentSessionId) {
      updateChatSession(currentSessionId, { title })
      setIsEditing(false)

      // Trigger haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleChange()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setTitle(currentSession.title)
    }
  }

  const handleBackSwipe = () => {
    router.push("/dashboard")

    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  return (
    <div
      className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background px-4"
      onTouchStart={(e) => {
        const touchStartX = e.touches[0].clientX

        const handleTouchEnd = (e: TouchEvent) => {
          const touchEndX = e.changedTouches[0].clientX
          const diff = touchEndX - touchStartX

          // If swiped right with enough distance, navigate back
          if (diff > 100) {
            handleBackSwipe()
          }

          document.removeEventListener("touchend", handleTouchEnd)
        }

        document.addEventListener("touchend", handleTouchEnd, { once: true })
      }}
    >
      <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 text-center">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={handleKeyDown}
            className="w-full max-w-[200px] border-b border-primary bg-transparent text-center text-lg font-medium outline-none"
            autoFocus
          />
        ) : (
          <h1
            className="cursor-pointer truncate text-lg font-medium"
            onClick={() => {
              setIsEditing(true)
              setTitle(currentSession.title)

              // Trigger haptic feedback
              if (navigator.vibrate) {
                navigator.vibrate(30)
              }
            }}
          >
            {currentSession.title}
          </h1>
        )}
      </motion.div>

      <div className="flex items-center">
        <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="h-auto max-h-[40%]">
            <SheetHeader>
              <SheetTitle>Search in conversation</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <div className="max-h-[200px] overflow-y-auto">
                {searchQuery &&
                  currentSession.messages
                    .filter((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((msg, i) => (
                      <div key={i} className="mb-2 rounded-md bg-muted p-2 text-sm">
                        <div className="mb-1 font-medium">{msg.role === "user" ? "You" : "AI"}</div>
                        <div className="line-clamp-2">{msg.content}</div>
                      </div>
                    ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
              <BookmarkPlus className="h-4 w-4" />
              <span>Save to Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
              <Share className="h-4 w-4" />
              <span>Share Chat</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Chat Info</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
              onClick={() => router.push("/dashboard")}
            >
              <span>End Chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
