"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"

// Define a type for the topic of the day
interface TopicOfDay {
  subject: string
  topic: string
  description: string
}

// Sample topics that can be randomly selected
const sampleTopics: TopicOfDay[] = [
  {
    subject: "Physics",
    topic: "Quantum Mechanics",
    description: "Explore the fascinating world of quantum physics and how it challenges our understanding of reality.",
  },
  {
    subject: "Mathematics",
    topic: "Calculus Fundamentals",
    description:
      "Learn about the core concepts of calculus that form the foundation of modern mathematics and physics.",
  },
  {
    subject: "Computer Science",
    topic: "Machine Learning Basics",
    description: "Discover how computers can learn from data and make predictions without explicit programming.",
  },
  {
    subject: "Biology",
    topic: "Cellular Respiration",
    description: "Understand how cells convert nutrients into energy through a series of metabolic reactions.",
  },
  {
    subject: "Literature",
    topic: "Modern Poetry Analysis",
    description: "Explore techniques for analyzing and interpreting contemporary poetry and its cultural significance.",
  },
  {
    subject: "History",
    topic: "Ancient Civilizations",
    description:
      "Journey through the rise and fall of ancient civilizations and their lasting impact on modern society.",
  },
]

export function TopicOfTheDay() {
  const { settings } = useStore()
  const [topic, setTopic] = useState<TopicOfDay>(sampleTopics[0])

  useEffect(() => {
    // Function to get a random topic
    const getRandomTopic = () => {
      const randomIndex = Math.floor(Math.random() * sampleTopics.length)
      return sampleTopics[randomIndex]
    }

    // Check if we should update the topic (e.g., once per day)
    const lastUpdated = localStorage.getItem("topicOfTheDay_lastUpdated")
    const today = new Date().toDateString()

    if (!lastUpdated || lastUpdated !== today) {
      const newTopic = getRandomTopic()
      setTopic(newTopic)
      localStorage.setItem("topicOfTheDay_lastUpdated", today)
      localStorage.setItem("topicOfTheDay", JSON.stringify(newTopic))
    } else {
      // Try to get the stored topic
      const storedTopic = localStorage.getItem("topicOfTheDay")
      if (storedTopic) {
        try {
          setTopic(JSON.parse(storedTopic))
        } catch (e) {
          // If parsing fails, set a new random topic
          setTopic(getRandomTopic())
        }
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Topic of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-1 text-xs text-muted-foreground">{topic.subject}</div>
          <h3 className="mb-2 text-xl font-medium">{topic.topic}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{topic.description}</p>

          <Link href={`/chat?topic=${encodeURIComponent(topic.topic)}`}>
            <Button className="w-full gap-2" variant="outline">
              <span>Explore this topic</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </CardContent>
    </Card>
  )
}
