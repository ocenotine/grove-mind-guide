"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Calendar, Gift, Clock } from "lucide-react"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { UserLevel } from "@/components/quests/user-level"
import { Button } from "@/components/ui/button"

export function QuestsView() {
  const { quests, user, updateQuestProgress } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const dailyQuests = quests.filter((quest) => quest.type === "daily")
  const weeklyQuests = quests.filter((quest) => quest.type === "weekly")
  const challenges = quests.filter((quest) => quest.type === "challenge")

  const handleProgressQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId)
    if (quest && !quest.completed) {
      updateQuestProgress(questId, quest.progress + 1)
    }
  }

  return (
    <AppLayout>
      <div className="container max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Study Quests</h1>
          <p className="text-muted-foreground">Complete quests to earn XP and unlock rewards</p>
        </div>

        <UserLevel user={user} className="mb-6" />

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Daily</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Weekly</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <div className="grid gap-4">
              {dailyQuests.length > 0 ? (
                dailyQuests.map((quest, index) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    index={index}
                    onProgress={() => handleProgressQuest(quest.id)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Daily Quests"
                  description="Check back tomorrow for new daily quests!"
                  icon={Clock}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="grid gap-4">
              {weeklyQuests.length > 0 ? (
                weeklyQuests.map((quest, index) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    index={index}
                    onProgress={() => handleProgressQuest(quest.id)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Weekly Quests"
                  description="Check back next week for new weekly quests!"
                  icon={Calendar}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="grid gap-4">
              {challenges.length > 0 ? (
                challenges.map((quest, index) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    index={index}
                    onProgress={() => handleProgressQuest(quest.id)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Challenges"
                  description="Complete daily and weekly quests to unlock challenges!"
                  icon={Trophy}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

function QuestCard({ quest, index, onProgress }: { quest: any; index: number; onProgress: () => void }) {
  const progress = Math.min(100, Math.round((quest.progress / quest.goal) * 100))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className={cn(quest.completed && "border-primary/50 bg-primary/5")}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {quest.title}
                {quest.completed && (
                  <Badge variant="default" className="ml-2">
                    Completed
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{quest.description}</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              {quest.type === "daily" ? (
                <Clock className="h-5 w-5" />
              ) : quest.type === "weekly" ? (
                <Calendar className="h-5 w-5" />
              ) : (
                <Trophy className="h-5 w-5" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">
                {quest.progress} / {quest.goal}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="pt-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <Gift className="h-4 w-4 text-primary" />
              <span>{quest.reward.xp} XP</span>
              {quest.reward.item && (
                <>
                  <span>+</span>
                  <span className="font-medium">
                    {quest.reward.item.startsWith("theme-")
                      ? quest.reward.item.replace("theme-", "").charAt(0).toUpperCase() +
                        quest.reward.item.replace("theme-", "").slice(1) +
                        " Theme"
                      : quest.reward.item.startsWith("avatar-")
                        ? quest.reward.item.replace("avatar-", "").charAt(0).toUpperCase() +
                          quest.reward.item.replace("avatar-", "").slice(1) +
                          " Avatar"
                        : quest.reward.item}
                  </span>
                </>
              )}
            </div>
            {!quest.completed ? (
              <Button size="sm" onClick={onProgress} disabled={quest.completed}>
                Progress
              </Button>
            ) : (
              quest.expiresAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {quest.type === "daily"
                      ? "Expires today"
                      : `Expires in ${Math.ceil((quest.expiresAt - Date.now()) / (24 * 60 * 60 * 1000))} days`}
                  </span>
                </div>
              )
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function EmptyState({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  )
}
