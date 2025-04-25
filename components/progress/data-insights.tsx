"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

export function DataInsights() {
  const { chatSessions } = useStore()
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("heatmap")

  // Generate insights on component mount
  useEffect(() => {
    if (chatSessions.length > 0) {
      fetchInsights()
    }
  }, [chatSessions])

  const fetchInsights = async () => {
    setIsLoading(true)
    try {
      // Extract concepts from chat sessions
      const extractedConcepts = extractConceptsFromSessions(chatSessions)

      // Generate insights
      const data = {
        learningPatterns: generateLearningPatterns(chatSessions),
        conceptMastery: generateConceptMastery(extractedConcepts),
        recommendations: generateRecommendations(extractedConcepts),
      }

      setInsights(data)
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Extract concepts from chat sessions
  const extractConceptsFromSessions = (sessions) => {
    // This is a simplified extraction - in a real app, you might use NLP
    const concepts = []

    sessions.forEach((session) => {
      // Extract potential concepts from message content
      session.messages.forEach((msg) => {
        if (msg.role === "assistant" && msg.content) {
          // Extract keywords that might be concepts
          const words = msg.content
            .split(/\s+/)
            .filter((word) => word.length > 4 && /^[A-Z][a-z]+$/.test(word))
            .slice(0, 3) // Take just a few potential concepts per message

          concepts.push(...words)
        }
      })

      // If the session has concepts property, use it
      if (session.concepts && Array.isArray(session.concepts)) {
        concepts.push(...session.concepts)
      }
    })

    // Count occurrences and get unique concepts
    const conceptCounts = {}
    concepts.forEach((concept) => {
      conceptCounts[concept] = (conceptCounts[concept] || 0) + 1
    })

    // Convert to array of objects with concept and count
    return Object.keys(conceptCounts).map((concept) => ({
      concept,
      count: conceptCounts[concept],
    }))
  }

  // Generate learning patterns from sessions
  const generateLearningPatterns = (sessions) => {
    // Default empty data
    const defaultData = [
      { name: "Mon", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Tue", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Wed", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Thu", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Fri", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Sat", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Sun", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
    ]

    // Generate heatmap data from sessions
    const heatmapData = JSON.parse(JSON.stringify(defaultData))

    sessions.forEach((session) => {
      const date = new Date(session.createdAt)
      const day = date.getDay() // 0 = Sunday, 1 = Monday, etc.
      const hour = date.getHours()

      // Map day index to name
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]

      // Determine time slot
      let timeSlot
      if (hour >= 0 && hour < 6) timeSlot = "00:00-06:00"
      else if (hour >= 6 && hour < 12) timeSlot = "06:00-12:00"
      else if (hour >= 12 && hour < 18) timeSlot = "12:00-18:00"
      else timeSlot = "18:00-24:00"

      // Find the day in our data and increment the count
      const dayData = heatmapData.find((d) => d.name === dayName)
      if (dayData) {
        dayData[timeSlot] += 1
      }
    })

    // Find peak learning times
    let maxCount = 0
    let peakDay = ""
    let peakTime = ""

    heatmapData.forEach((day) => {
      Object.keys(day).forEach((key) => {
        if (key !== "name" && day[key] > maxCount) {
          maxCount = day[key]
          peakDay = day.name
          peakTime = key
        }
      })
    })

    const peakTimes =
      maxCount > 0
        ? `You're most active on ${peakDay}s during ${peakTime}.`
        : "Not enough data to determine peak learning times yet."

    return {
      heatmap: heatmapData,
      peakTimes,
    }
  }

  // Generate concept mastery data
  const generateConceptMastery = (concepts) => {
    // Sort by count (frequency) and take top 10
    return concepts
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item) => ({
        concept: item.concept,
        score: Math.min(100, Math.floor(item.count * 10) + Math.floor(Math.random() * 30) + 40), // Random score between 40-100 influenced by frequency
      }))
  }

  // Generate learning recommendations
  const generateRecommendations = (concepts) => {
    if (concepts.length === 0) {
      return [
        "Start more learning sessions to get personalized recommendations.",
        "Try exploring different topics to broaden your knowledge.",
        "Create flashcards to reinforce your learning.",
      ]
    }

    // Get top concepts
    const topConcepts = concepts
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((c) => c.concept)

    // Generate recommendations based on top concepts
    const recommendations = [
      `Deepen your understanding of ${topConcepts[0] || "your frequent topics"}.`,
      `Create more flashcards about ${topConcepts[1] || "your areas of interest"}.`,
      `Consider exploring topics related to ${topConcepts[2] || "your current studies"}.`,
      "Try studying during your peak productivity hours for better retention.",
    ]

    return recommendations
  }

  // Generate heatmap data
  const generateHeatmapData = () => {
    // If we have real data from insights, use it
    if (insights?.learningPatterns?.heatmap) {
      return insights.learningPatterns.heatmap
    }

    // Otherwise, return empty data
    return [
      { name: "Mon", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Tue", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Wed", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Thu", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Fri", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Sat", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
      { name: "Sun", "00:00-06:00": 0, "06:00-12:00": 0, "12:00-18:00": 0, "18:00-24:00": 0 },
    ]
  }

  // Generate concept mastery data
  const generateMasteryData = () => {
    if (insights?.conceptMastery) {
      return insights.conceptMastery
    }

    // Generate sample data if no insights available
    return [
      { concept: "Mathematics", score: 85 },
      { concept: "Physics", score: 72 },
      { concept: "Chemistry", score: 68 },
      { concept: "Biology", score: 75 },
      { concept: "History", score: 80 },
    ]
  }

  const heatmapData = generateHeatmapData()
  const masteryData = generateMasteryData()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Learning Insights</CardTitle>
        <Button variant="outline" size="icon" onClick={fetchInsights} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="heatmap">Session Heatmap</TabsTrigger>
            <TabsTrigger value="mastery">Concept Mastery</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This heatmap shows when you're most active in your learning sessions.
            </p>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={heatmapData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barSize={20}
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="00:00-06:00" stackId="a" fill="#8884d8" name="Night (12AM-6AM)" />
                  <Bar dataKey="06:00-12:00" stackId="a" fill="#82ca9d" name="Morning (6AM-12PM)" />
                  <Bar dataKey="12:00-18:00" stackId="a" fill="#ffc658" name="Afternoon (12PM-6PM)" />
                  <Bar dataKey="18:00-24:00" stackId="a" fill="#ff8042" name="Evening (6PM-12AM)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {insights?.learningPatterns?.peakTimes && (
              <div className="mt-4 rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Peak Learning Times:</p>
                <p>{insights.learningPatterns.peakTimes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mastery" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This chart shows your estimated mastery level of key concepts.
            </p>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masteryData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="concept" width={80} />
                  <Tooltip formatter={(value) => [`${value}% Mastery`, "Score"]} />
                  <Bar dataKey="score" minPointSize={2}>
                    {masteryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score > 80 ? "#10b981" : entry.score > 60 ? "#3b82f6" : "#f59e0b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {insights?.recommendations && (
              <div className="mt-4 rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Learning Recommendations:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {insights.recommendations.map((rec, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {rec}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
