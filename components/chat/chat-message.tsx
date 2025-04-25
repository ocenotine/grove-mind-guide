"use client"

import { useState, useEffect } from "react"
import type { ChatMessage as ChatMessageType } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, Check, ThumbsUp, ThumbsDown, Bookmark, Share, Smile } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import "katex/dist/katex.min.css"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatMessageProps {
  message: ChatMessageType
  isLastMessage: boolean
}

export function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
  const { user, activeChatSession, chatSessions, setChatSessions } = useStore()
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visibleText, setVisibleText] = useState("")
  const [isTyping, setIsTyping] = useState(isLastMessage && message.role === "assistant")
  const [showReactions, setShowReactions] = useState(false)

  // Get typing speed based on user preferences
  const getTypingSpeed = () => {
    if (!user?.preferences?.typingAnimation) return 0

    switch (user?.preferences?.typingSpeed) {
      case "slow":
        return 30
      case "fast":
        return 5
      default:
        return 15 // medium
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Typewriter effect for the last assistant message
  useEffect(() => {
    if (isLastMessage && message.role === "assistant" && message.content && user?.preferences?.typingAnimation) {
      setIsTyping(true)
      let i = 0
      const speed = getTypingSpeed()

      if (speed === 0) {
        // Skip animation if typing animation is disabled
        setVisibleText(message.content)
        setIsTyping(false)
        return
      }

      const interval = setInterval(() => {
        if (i < message.content.length) {
          setVisibleText(message.content.substring(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, speed)

      return () => clearInterval(interval)
    } else {
      setVisibleText(message.content)
    }
  }, [isLastMessage, message.content, message.role, user?.preferences?.typingAnimation, user?.preferences?.typingSpeed])

  // Haptic feedback function
  const triggerHapticFeedback = () => {
    if (user?.preferences?.sound && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  if (!mounted) return null

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    triggerHapticFeedback()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLike = (value: boolean) => {
    setLiked(value)
    triggerHapticFeedback()
  }

  const toggleBookmark = () => {
    setBookmarked(!bookmarked)
    triggerHapticFeedback()
  }

  // Custom function to add reaction to message
  const handleReaction = (emoji: string) => {
    if (activeChatSession) {
      // Find the active session
      const updatedSessions = chatSessions.map((session) => {
        if (session.id === activeChatSession) {
          // Find the message and add the reaction
          const updatedMessages = session.messages.map((msg) => {
            if (msg.id === message.id) {
              // Create or update reactions array
              const reactions = msg.reactions ? [...msg.reactions, emoji] : [emoji]
              return { ...msg, reactions }
            }
            return msg
          })

          return { ...session, messages: updatedMessages }
        }
        return session
      })

      // Update the sessions in the store
      setChatSessions(updatedSessions)
      setShowReactions(false)
      triggerHapticFeedback()
    }
  }

  const reactions = ["👍", "👎", "❤️", "😂", "😮", "🤔", "💡", "🎉"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-6 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
      onContextMenu={(e) => {
        e.preventDefault()
        setShowReactions(!showReactions)
        return false
      }}
    >
      <div
        className={`relative max-w-[85%] rounded-lg p-4 ${
          message.role === "user"
            ? "rounded-tr-none bg-primary text-primary-foreground"
            : "rounded-tl-none bg-card text-card-foreground"
        }`}
      >
        <div className="flex items-start gap-3">
          {message.role === "assistant" && (
            <Avatar className="mt-1 h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="AI" />
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
          )}

          <div className="flex-1">
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    return !inline && match ? (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6 rounded-md bg-secondary/50 p-1 text-muted-foreground hover:bg-secondary"
                          onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ""))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {isLastMessage && message.role === "assistant" ? visibleText : message.content}
              </ReactMarkdown>

              {isTyping && (
                <div className="typing-indicator mt-2">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
              )}
            </div>

            {/* Message reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {message.reactions.map((reaction, index) => (
                  <span
                    key={index}
                    className="inline-flex h-6 items-center justify-center rounded-full bg-muted px-2 text-xs"
                  >
                    {reaction}
                  </span>
                ))}
              </div>
            )}

            {message.role === "assistant" && !isTyping && (
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-full ${liked === true ? "text-green-500" : ""}`}
                  onClick={() => handleLike(true)}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-full ${liked === false ? "text-red-500" : ""}`}
                  onClick={() => handleLike(false)}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-full ${bookmarked ? "text-yellow-500" : ""}`}
                  onClick={toggleBookmark}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="flex flex-wrap gap-1 p-2" style={{ width: "180px" }}>
                    {reactions.map((emoji) => (
                      <DropdownMenuItem
                        key={emoji}
                        className="cursor-pointer p-1 text-lg hover:bg-muted"
                        onClick={() => handleReaction(emoji)}
                      >
                        {emoji}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {message.role === "user" && (
            <Avatar className="mt-1 h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Reaction popup on long press */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute left-0 top-0 z-10 flex -translate-y-full transform flex-wrap gap-1 rounded-lg bg-popover p-2 shadow-lg"
            >
              {reactions.map((emoji) => (
                <button
                  key={emoji}
                  className="cursor-pointer rounded p-1 text-lg hover:bg-muted"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
