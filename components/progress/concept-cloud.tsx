"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

interface ConceptCloudProps {
  concepts: string[]
}

export function ConceptCloud({ concepts }: ConceptCloudProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredConcepts, setFilteredConcepts] = useState<string[]>([])

  // Memoize the concept counts and unique concepts to prevent recalculation on every render
  const { conceptCounts, uniqueConcepts } = useMemo(() => {
    // Count occurrences of each concept
    const counts = concepts.reduce(
      (acc, concept) => {
        acc[concept] = (acc[concept] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Get unique concepts
    const unique = Array.from(new Set(concepts))

    return { conceptCounts: counts, uniqueConcepts: unique }
  }, [concepts])

  // Update filtered concepts when search term changes
  useEffect(() => {
    if (searchTerm) {
      setFilteredConcepts(uniqueConcepts.filter((concept) => concept.toLowerCase().includes(searchTerm.toLowerCase())))
    } else {
      setFilteredConcepts(uniqueConcepts)
    }
  }, [searchTerm, uniqueConcepts])

  // Function to determine font size based on frequency
  const getFontSize = (concept: string) => {
    const count = conceptCounts[concept]
    if (count >= 5) return "text-xl font-bold"
    if (count >= 3) return "text-lg font-semibold"
    if (count >= 2) return "text-base font-medium"
    return "text-sm"
  }

  // Function to get a random color class
  const getColorClass = (concept: string) => {
    const colors = [
      "text-blue-500",
      "text-green-500",
      "text-purple-500",
      "text-pink-500",
      "text-yellow-500",
      "text-red-500",
      "text-indigo-500",
      "text-orange-500",
    ]
    // Use the concept string to deterministically select a color
    const index = concept.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Concept Cloud</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredConcepts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredConcepts.map((concept, index) => (
              <motion.span
                key={concept}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`cursor-pointer rounded-full bg-muted px-3 py-1 ${getFontSize(concept)} ${getColorClass(
                  concept,
                )}`}
              >
                {concept}
              </motion.span>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {searchTerm ? "No matching concepts found" : "No concepts learned yet"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
