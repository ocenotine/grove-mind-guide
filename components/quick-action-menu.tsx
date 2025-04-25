"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Upload, Mic, Settings, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

interface QuickActionMenuProps {
  className?: string
}

export function QuickActionMenu({ className }: QuickActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()
  const { createChatSession, setActiveChatSession } = useStore()
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling down - hide menu
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current - 10 || currentScrollY <= 0) {
        // Scrolling up or at top - show menu
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)

    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(isOpen ? 50 : [30, 50, 30])
    }
  }

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)

    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const startNewChat = () => {
    const sessionId = createChatSession()
    setActiveChatSession(sessionId)
    router.push("/chat")
  }

  const uploadDocument = () => {
    router.push("/documents")
  }

  const openSettings = () => {
    router.push("/settings")
  }

  const startVoiceChat = () => {
    const sessionId = createChatSession()
    setActiveChatSession(sessionId)
    router.push("/chat?voice=true")
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Action buttons */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-24 right-4 z-50 flex flex-col items-end gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-lg dark:bg-gray-800">
                  New Chat
                </div>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
                  onClick={() => handleAction(startNewChat)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-lg dark:bg-gray-800">
                  Upload Document
                </div>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600"
                  onClick={() => handleAction(uploadDocument)}
                >
                  <Upload className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-lg dark:bg-gray-800">
                  Voice Chat
                </div>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600"
                  onClick={() => handleAction(startVoiceChat)}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-lg dark:bg-gray-800">
                  Settings
                </div>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-gray-500 text-white shadow-lg hover:bg-gray-600"
                  onClick={() => handleAction(openSettings)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        onClick={toggleMenu}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}
