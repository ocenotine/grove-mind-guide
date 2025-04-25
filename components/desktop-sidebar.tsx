"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, BookOpen, BarChart2, FileText, Settings, Trophy, Brain } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DesktopSidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { user } = useStore()
  const [expanded, setExpanded] = useState(true)
  const [animalAvatar, setAnimalAvatar] = useState("")

  useEffect(() => {
    setMounted(true)

    // Generate a random animal avatar
    const animals = ["cat", "dog", "fox", "panda", "koala", "lion", "tiger", "bear", "rabbit", "wolf"]
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
    setAnimalAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${randomAnimal}`)
  }, [])

  if (!mounted) return null

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Flashcards",
      href: "/flashcards",
      icon: BookOpen,
    },
    {
      name: "Progress",
      href: "/progress",
      icon: BarChart2,
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
    },
    {
      name: "Games",
      href: "/games",
      icon: Trophy,
      badge: "New",
    },
    {
      name: "Brain Boost",
      href: "/brain-boost",
      icon: Brain,
      badge: "New",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="hidden md:block">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300",
          expanded ? "w-64" : "w-20",
        )}
      >
        <div
          className="flex h-full flex-col overflow-y-auto bg-gradient-to-b from-primary to-primary-900 shadow-lg"
          style={{
            backgroundImage: "linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary)/0.8))",
          }}
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/logo.png" alt="MindGrove Logo" width={32} height={32} />
              </motion.div>
              {expanded && (
                <motion.span
                  className="text-lg font-bold text-white"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Mindgrove
                </motion.span>
              )}
            </Link>
            <button onClick={() => setExpanded(!expanded)} className="rounded-full p-1 text-white hover:bg-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${expanded ? "rotate-0" : "rotate-180"}`}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4">
            <TooltipProvider delayDuration={0}>
              <ul className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <li key={item.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                              isActive ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                            )}
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <item.icon className={cn("h-5 w-5", isActive && "text-white")} />
                            </motion.div>

                            {expanded && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex-1"
                              >
                                {item.name}
                              </motion.span>
                            )}

                            {expanded && item.badge && (
                              <Badge variant="outline" className="border-white/30 bg-white/20 text-white">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {!expanded && (
                          <TooltipContent side="right">
                            <p>{item.name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  )
                })}
              </ul>
            </TooltipProvider>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.avatar || animalAvatar} alt="User" />
                  <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
                </Avatar>
                {expanded && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                    <p className="text-xs text-white/70">Level {user?.level || 1}</p>
                  </div>
                )}
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className={cn("transition-all duration-300", expanded ? "ml-64" : "ml-20")} />
    </div>
  )
}
