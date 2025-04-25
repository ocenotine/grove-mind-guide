"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useStore } from "@/lib/store"
import { extractConcepts, generateFlashcards, processPdfFile, summarizeDocument } from "@/lib/api"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { AppLayout } from "@/components/app-layout"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessage } from "@/components/chat/chat-message"
import { streamChatCompletion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Loading } from "@/components/ui/loading"
import { Fallback } from "@/components/ui/fallback"

export function ChatView() {
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic")
  const documentId = searchParams.get("document")

  const {
    chatSessions,
    currentSessionId,
    createChatSession,
    addMessageToSession,
    updateChatSession,
    addConcept,
    setUserMood,
    user,
    createFlashcard,
    incrementStreak,
    resetStreak,
    lastActive,
    setCurrentSessionId,
    activeChatSession,
    closeChatSession,
    setActiveChatSession,
  } = useStore()

  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showContextBubble, setShowContextBubble] = useState(false)
  const [contextMessage, setContextMessage] = useState("")
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false)
  const [fileUploadProgress, setFileUploadProgress] = useState(0)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [lastScrollPosition, setLastScrollPosition] = useState(0)
  const [hideUI, setHideUI] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const touchStartY = useRef(0)
  const lastScrollY = useRef(0)
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    // If there's no active chat session, create one
    if (!activeChatSession) {
      createChatSession()
    }
  }, [activeChatSession, createChatSession])

  // Handle streak updates
  useEffect(() => {
    // Check if we need to increment streak
    const today = new Date().toDateString()
    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      if (lastActive === yesterdayString) {
        incrementStreak()
        toast({
          title: "Streak Updated!",
          description: `You've maintained your learning streak for ${user.streak + 1} days! 🔥`,
        })
      } else if (lastActive && lastActive !== today) {
        // Reset streak if more than a day has passed
        resetStreak()
        toast({
          title: "Streak Reset",
          description: "Start a new learning streak today!",
          variant: "destructive",
        })
      }

      // Update last active date to today
      useStore.setState({ lastActive: today })
    }
  }, [lastActive, incrementStreak, resetStreak, user.streak])

  // Get current session or create a new one
  useEffect(() => {
    // Check if we need to create a new session
    const shouldCreateNewSession = !currentSessionId || !chatSessions.some((session) => session.id === currentSessionId)

    // if (shouldCreateNewSession) {
    //   const newSessionId = createChatSession();

    //   // If there's a topic from URL params, use it to start the conversation
    //   if (topic) {
    //     const systemMessage = {
    //       id: uuidv4(),
    //       role: "system" as const,
    //       content:
    //         "You are Mindgrove, an AI tutor that helps users learn about various subjects. Be concise, clear, and helpful. Use markdown formatting for better readability. Use LaTeX for mathematical expressions when appropriate.",
    //     }

    //     const userMessage = {
    //       id: uuidv4(),
    //       role: "user" as const,
    //       content: `I'd like to learn about ${topic}. Can you give me an introduction?`,
    //     }

    //     // Add system message
    //     addMessageToSession(newSessionId, systemMessage)

    //     // Add user message
    //     addMessageToSession(newSessionId, userMessage)

    //     // Generate AI response
    //     handleAIResponse(newSessionId, [systemMessage, userMessage])

    //     // Update session title
    //     updateChatSession(newSessionId, { title: `Learning about ${topic}` })

    //     // Show context bubble
    //     setContextMessage(`Learning about ${topic}`)
    //     setShowContextBubble(true)
    //     setTimeout(() => setShowContextBubble(false), 3000)
    //   } else if (documentId) {
    //     // Handle document-based chat
    //     const systemMessage = {
    //       id: uuidv4(),
    //       role: "system" as const,
    //       content:
    //         "You are Mindgrove, an AI tutor that helps users learn from documents. Be concise, clear, and helpful. Use markdown formatting for better readability. Use LaTeX for mathematical expressions when appropriate.",
    //     }

    //     const userMessage = {
    //       id: uuidv4(),
    //       role: "user" as const,
    //       content: `I've uploaded a document and would like to discuss it. Can you help me understand the key concepts?`,
    //     }

    //     // Add system message
    //     addMessageToSession(newSessionId, systemMessage)

    //     // Add user message
    //     addMessageToSession(newSessionId, userMessage)

    //     // Generate AI response
    //     handleAIResponse(newSessionId, [systemMessage, userMessage])

    //     // Update session title
    //     updateChatSession(newSessionId, { title: `Document Discussion` })

    //     // Show context bubble
    //     setContextMessage("Analyzing document")
    //     setShowContextBubble(true)
    //     setTimeout(() => setShowContextBubble(false), 3000)
    //   } else {
    //     // Add system message
    //     addMessageToSession(newSessionId, {
    //       id: uuidv4(),
    //       role: "system",
    //       content:
    //         "You are Mindgrove, an AI tutor that helps users learn about various subjects. Be concise, clear, and helpful. Use markdown formatting for better readability. Use LaTeX for mathematical expressions when appropriate.",
    //     })
    //   }
    // }
  }, [currentSessionId, chatSessions, createChatSession, addMessageToSession, topic, documentId, updateChatSession])

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

      // Track scroll position to determine direction
      const currentScrollY = scrollTop
      const scrollingDown = currentScrollY > lastScrollY.current
      lastScrollY.current = currentScrollY

      // Show/hide UI based on scroll direction
      if (scrollingDown && currentScrollY > 60) {
        setHideUI(true)
      } else {
        setHideUI(false)
      }

      setShowScrollButton(!isNearBottom)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatSessions, currentSessionId])

  useEffect(() => {
    scrollToBottom()
  }, [chatSessions, activeChatSession])

  // Touch event handlers for pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === 0) return

    const touchY = e.touches[0].clientY
    const distance = touchY - touchStartY.current

    if (distance > 5) {
      e.preventDefault() // Prevent default scrolling
      setIsPulling(true)
      setPullDistance(Math.min(distance * 0.5, 100)) // Limit max pull distance
    }
  }

  const handleTouchEnd = () => {
    if (isPulling) {
      if (pullDistance > 70) {
        // Trigger refresh action
        toast({
          title: "Refreshing...",
          description: "Your brain is charging with new knowledge!",
        })

        // Simulate refresh
        setTimeout(() => {
          setIsPulling(false)
          setPullDistance(0)
          touchStartY.current = 0
        }, 1000)
      } else {
        // Reset without action
        setIsPulling(false)
        setPullDistance(0)
        touchStartY.current = 0
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const currentSession = chatSessions.find((session) => session.id === currentSessionId)
  const messages = currentSession?.messages || []

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeChatSession) return

    try {
      // Add user message to the session
      const messageId = addMessageToSession(activeChatSession, {
        role: "user",
        content,
      })

      setIsLoading(true)
      setError(null)

      // Get the updated session after adding the user message
      const updatedSession = chatSessions.find((session) => session.id === activeChatSession)
      if (!updatedSession) throw new Error("Session not found")

      // Ensure there's a system message
      const hasSystemMessage = updatedSession.messages.some((msg) => msg.role === "system")
      let messages = updatedSession.messages

      if (!hasSystemMessage) {
        // Add a system message if none exists
        const systemMessageId = addMessageToSession(activeChatSession, {
          role: "system",
          content:
            "You are Mindgrove, an AI tutor and research assistant. You help users learn and understand complex topics.",
        })

        // Get the updated session again after adding the system message
        const sessionWithSystem = chatSessions.find((session) => session.id === activeChatSession)
        if (!sessionWithSystem) throw new Error("Session not found after adding system message")

        messages = sessionWithSystem.messages
      }

      // Create a temporary message ID for the assistant's response
      const assistantMessageId = uuidv4()

      // Add an empty assistant message that will be updated as the stream comes in
      addMessageToSession(activeChatSession, {
        role: "assistant",
        content: "",
      })

      let assistantMessage = ""

      // Stream the chat completion
      await streamChatCompletion(messages, (chunk) => {
        assistantMessage += chunk

        // Update the assistant message with the accumulated content
        const sessionToUpdate = chatSessions.find((session) => session.id === activeChatSession)
        if (sessionToUpdate) {
          const lastMessageIndex = sessionToUpdate.messages.length - 1
          if (lastMessageIndex >= 0) {
            // Update the last message (which should be the assistant's message)
            addMessageToSession(activeChatSession, {
              role: "assistant",
              content: assistantMessage,
            })
          }
        }
      })

      scrollToBottom()
    } catch (err) {
      console.error("Error in chat completion:", err)
      setError("Failed to get a response. Please try again.")
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    // Close the current chat if there is one
    if (activeChatSession) {
      closeChatSession(activeChatSession)
    }

    // Create a new chat session
    createChatSession()
  }

  const handleCloseChat = () => {
    if (activeChatSession) {
      closeChatSession(activeChatSession)
    }
  }

  const handleSelectChat = (sessionId: string) => {
    setActiveChatSession(sessionId)
  }

  if (!mounted) return null

  if (error) {
    return <Fallback error={error} retry={() => setError(null)} />
  }

  const handleFileUpload = async (file: File) => {
    if (!currentSessionId) return

    setIsProcessingFile(true)
    setFileUploadProgress(0)

    try {
      // Process the file
      setFileUploadProgress(20)
      let content = ""

      if (file.type === "application/pdf") {
        content = await processPdfFile(file)
      } else if (file.type === "text/plain") {
        content = await file.text()
      } else {
        throw new Error("Unsupported file format")
      }

      setFileUploadProgress(40)

      // Generate summary
      const summary = await summarizeDocument(content.slice(0, 10000))
      setFileUploadProgress(60)

      // Extract concepts
      const concepts = await extractConcepts(content.slice(0, 5000))
      setFileUploadProgress(80)

      // Generate flashcards
      const flashcards = await generateFlashcards(content.slice(0, 5000))
      setFileUploadProgress(100)

      // Add message to chat about the uploaded document
      addMessageToSession(currentSessionId, {
        id: uuidv4(),
        role: "user",
        content: `I've uploaded a document called "${file.name}". Please help me understand it.`,
      })

      // Add assistant message with summary
      addMessageToSession(currentSessionId, {
        id: uuidv4(),
        role: "assistant",
        content: `I've analyzed your document "${file.name}". Here's a summary:\n\n${summary}\n\n**Key Concepts**: ${concepts.join(", ")}\n\nI've also created ${flashcards.length} flashcards based on this document that you can review later. What specific aspects would you like to discuss?`,
      })
    } catch (error: any) {
      console.error("File processing error:", error)
      toast({
        title: "Error",
        description: `Failed to process file: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessingFile(false)
      setFileUploadProgress(0)
    }
  }

  const handleAIResponse = async (sessionId: string, messages: any) => {
    setIsLoading(true)
    try {
      const response = await streamChatCompletion(messages, (content) => {
        addMessageToSession(sessionId, {
          id: uuidv4(),
          role: "assistant",
          content: content,
        })
      })
    } catch (error: any) {
      console.error("Error in chat completion:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const activeSession = chatSessions.find((session) => session.id === activeChatSession)

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <ChatHeader
          session={activeSession}
          onNewChat={handleNewChat}
          onCloseChat={handleCloseChat}
          sessions={chatSessions}
          onSelectChat={handleSelectChat}
        />
        <div className="flex-1 overflow-y-auto p-4">
          {activeSession?.messages
            .filter((msg) => msg.role !== "system") // Don't show system messages
            .map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          {isLoading && <Loading className="py-4" />}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </AppLayout>
  )
}
