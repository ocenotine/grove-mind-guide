"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import type { User } from "@/lib/store"

interface UserLevelProps {
  user: User
  className?: string
}

export function UserLevel({ user, className }: UserLevelProps) {
  const progress = Math.round((user.xp / user.xpToNextLevel) * 100)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Star className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-medium">Level {user.level}</h3>
              <span className="text-sm font-medium">
                {user.xp} / {user.xpToNextLevel} XP
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-medium">{user.streak} day streak</span>
            {user.streak > 0 && <span className="text-orange-500">🔥</span>}
          </div>
          <div className="flex items-center gap-1">
            <span>{user.badges.length} badges earned</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
