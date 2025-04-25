"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, MessageSquare, BookOpen, BarChart2, FileText, Trophy, Brain } from "lucide-react"
import { motion } from "framer-motion"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling down - hide nav
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current - 10 || currentScrollY <= 0) {
        // Scrolling up or at top - show nav
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

  if (!mounted) return null

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Cards",
      href: "/flashcards",
      icon: BookOpen,
    },
    {
      name: "Progress",
      href: "/progress",
      icon: BarChart2,
    },
    {
      name: "Docs",
      href: "/documents",
      icon: FileText,
    },
    {
      name: "Games",
      href: "/games",
      icon: Trophy,
    },
    {
      name: "Boost",
      href: "/brain-boost",
      icon: Brain,
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <motion.div
      className="fixed bottom-4 left-0 z-50 flex w-full justify-center md:hidden"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-auto flex h-14 items-center justify-around rounded-full bg-gradient-to-r from-primary to-primary-900/90 px-6 backdrop-blur-md"
        style={{
          width: "95%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className="relative flex flex-col items-center justify-center"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute h-10 w-10 rounded-full bg-white/20"
                  style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive ? "text-white" : "text-white/70 hover:text-white",
                )}
              />
              <span className="mt-1 text-[10px] font-medium text-white/80">{item.name}</span>
            </button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
