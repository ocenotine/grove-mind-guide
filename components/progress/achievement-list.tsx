"use client"

import type { Achievement } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Flame, Layers, FileText, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

interface AchievementListProps {
  achievements?: Achievement[]
}

export function AchievementList({ achievements = [] }: AchievementListProps) {
  // Map achievement icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "flame":
        return <Flame className="h-6 w-6" />
      case "calendar":
        return <Calendar className="h-6 w-6" />
      case "layers":
        return <Layers className="h-6 w-6" />
      case "file-text":
        return <FileText className="h-6 w-6" />
      default:
        return <MessageSquare className="h-6 w-6" />
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`achievement-badge ${achievement.unlocked ? "unlocked" : "locked"} overflow-hidden transition-all hover:shadow-md`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  achievement.unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {getIcon(achievement.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
