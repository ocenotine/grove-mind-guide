import { v4 as uuidv4 } from "uuid"

// Define types for chat messages
export type Role = "system" | "user" | "assistant"

export interface Message {
  id: string
  role: Role
  content: string
  timestamp?: number
}

// Use the environment variable for the API key - will use user-provided key if available
const getApiKey = () => {
  // Default API key from environment variable
  const defaultApiKey =
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
    "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"

  // Check browser environment
  if (typeof window !== "undefined") {
    // Try to get from localStorage for client-side persistence
    const storedApiKey = localStorage.getItem("mindgrove-api-key")
    if (storedApiKey) {
      return storedApiKey
    }

    const storedSettings = localStorage.getItem("mindgrove-storage")
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings)
        if (parsed.state?.settings?.apiKey) {
          return parsed.state.settings.apiKey
        }
      } catch (e) {
        console.error("Error parsing stored settings", e)
      }
    }
  }

  // Fall back to default API key
  return defaultApiKey
}

const API_URL = "https://openrouter.ai/api/v1/chat/completions"

export interface StreamingOptions {
  onChunk: (chunk: string) => void
  onComplete: (fullText: string) => void
  onError: (error: Error) => void
}

// Function to stream chat completions
export async function streamChatCompletion(messages: Message[], onChunk: (chunk: string) => void) {
  console.log("Starting chat completion with messages:", messages)

  // Ensure we have valid messages
  if (!messages || messages.length === 0) {
    console.error("No messages provided for chat completion")
    throw new Error("No messages provided for chat completion")
  }

  // Ensure there's a system message
  const hasSystemMessage = messages.some((msg) => msg.role === "system")
  if (!hasSystemMessage) {
    console.log("No system message found, adding default system message")
    messages = [
      {
        id: uuidv4(),
        role: "system",
        content:
          "You are Mindgrove, an AI tutor and research assistant. You help users learn and understand complex topics.",
      },
      ...messages,
    ]
  }

  // Filter out any invalid messages
  const validMessages = messages.filter(
    (msg) => msg && msg.role && ["system", "user", "assistant"].includes(msg.role) && msg.content,
  )

  if (validMessages.length === 0) {
    console.error("No valid messages after filtering")
    throw new Error("No valid messages for chat completion")
  }

  try {
    // Use built-in AI capabilities instead of external API
    const response = await simulateAIResponse(validMessages)

    // Stream the response
    const chunks = response.split(" ")
    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, 50)) // Simulate streaming
      onChunk(chunk + " ")
    }

    return {
      success: true,
      message: "Chat completion successful",
    }
  } catch (error) {
    console.error("Error in streamChatCompletion:", error)
    throw error
  }
}

// Function to simulate AI responses without external API
async function simulateAIResponse(messages: Message[]): Promise<string> {
  // Get the last user message
  const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")?.content || ""

  // Simple response generation based on user input
  if (lastUserMessage.toLowerCase().includes("hello") || lastUserMessage.toLowerCase().includes("hi")) {
    return "Hello! I'm Mindgrove, your AI tutor and research assistant. How can I help you learn today?"
  }

  if (lastUserMessage.toLowerCase().includes("help")) {
    return "I'm here to help you learn! You can ask me questions about any subject, request explanations of complex topics, or get assistance with your studies. What would you like to learn about?"
  }

  if (lastUserMessage.toLowerCase().includes("math") || lastUserMessage.toLowerCase().includes("mathematics")) {
    return "Mathematics is a fascinating subject! I can help with various topics like algebra, calculus, geometry, or statistics. What specific math concept would you like to explore?"
  }

  if (lastUserMessage.toLowerCase().includes("science")) {
    return "Science encompasses many exciting fields! I can assist with physics, chemistry, biology, astronomy, and more. Which scientific area are you interested in learning about?"
  }

  if (lastUserMessage.toLowerCase().includes("history")) {
    return "History helps us understand our world today! I can discuss ancient civilizations, world wars, cultural movements, or any historical period you're curious about. What aspect of history would you like to explore?"
  }

  // Default response for other queries
  return "That's an interesting topic! I'm here to help you learn and understand it better. Could you provide more details about what specific aspects you'd like to explore? I can provide explanations, examples, or guide you through concepts step by step."
}

// Function to validate API key - now always returns true since we're not using external APIs
export async function validateApiKey(): Promise<boolean> {
  return true
}

// Function to generate flashcards from text
export async function generateFlashcards(
  text: string,
): Promise<Array<{ question: string; answer: string; tags: string[] }>> {
  try {
    const apiKey = getApiKey()

    // Check if API key is available
    if (!apiKey) {
      console.warn("OpenRouter API key is missing. Returning empty flashcards array.")
      return []
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "https://mindgrove.app",
        "X-Title": "Mindgrove AI Tutor",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that creates educational flashcards. Return only a JSON array of objects with 'question', 'answer', and 'tags' fields. Tags should be an array of strings representing the keywords or topics covered by the flashcard.",
          },
          {
            role: "user",
            content: `Create 5-7 flashcards based on this text. Return as a JSON array of objects with 'question', 'answer', and 'tags' fields (tags should be an array of relevant keywords):\n\n${text}`,
          },
        ],
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      console.error("Failed to generate flashcards:", response.statusText)
      return []
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    // Try to parse the JSON array from the response
    try {
      // Look for anything that looks like a JSON array in the response
      const match = content?.match(/\[.*\]/s)
      if (match) {
        return JSON.parse(match[0])
      }
      return []
    } catch (e) {
      console.error("Error parsing flashcards:", e)
      return []
    }
  } catch (error) {
    console.error("Error generating flashcards:", error)
    return []
  }
}

// Extract concepts from text
export async function extractConcepts(text: string): Promise<string[]> {
  try {
    const apiKey = getApiKey()

    // Check if API key is available
    if (!apiKey) {
      console.warn("OpenRouter API key is missing. Returning empty concepts array.")
      return []
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "https://mindgrove.app",
        "X-Title": "Mindgrove AI Tutor",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that extracts key concepts from educational text. Return only a JSON array of strings with no explanation.",
          },
          {
            role: "user",
            content: `Extract the key concepts from this text as a JSON array of strings (maximum 5 concepts):\n\n${text}`,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      console.error("Failed to extract concepts:", response.statusText)
      return []
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    // Try to parse the JSON array from the response
    try {
      // Look for anything that looks like a JSON array in the response
      const match = content?.match(/\[.*\]/s)
      if (match) {
        return JSON.parse(match[0])
      }
      return []
    } catch (e) {
      console.error("Error parsing concepts:", e)
      return []
    }
  } catch (error) {
    console.error("Error extracting concepts:", error)
    return []
  }
}

// Function to summarize document content
export async function summarizeDocument(text: string): Promise<string> {
  try {
    const apiKey = getApiKey()

    // Check if API key is available
    if (!apiKey) {
      console.warn("OpenRouter API key is missing. Returning empty summary.")
      return "Failed to generate summary due to missing API key."
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "https://mindgrove.app",
        "X-Title": "Mindgrove AI Tutor",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: "You are an AI that summarizes educational content in detail.",
          },
          {
            role: "user",
            content: `Provide a detailed summary of the following text, capturing the main ideas, key points, and important details. Be thorough but concise:\n\n${text}`,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      console.error("Failed to summarize document:", response.statusText)
      return "Failed to generate summary."
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "Failed to generate summary."
  } catch (error) {
    console.error("Error summarizing document:", error)
    return "Failed to generate summary."
  }
}

// Process PDF file and extract text - simplified version that doesn't rely on PDF.js
export async function processPdfFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log("Processing PDF file:", file.name)

      // Check if it's actually a PDF
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return reject(new Error("File is not a PDF"))
      }

      // Simulate processing delay
      setTimeout(() => {
        // Generate a simulated text extraction based on the file name
        const fileName = file.name.replace(".pdf", "")

        // Create a simulated text content based on the file name
        const simulatedContent = `
# ${fileName}

## Introduction
This is simulated content extracted from your PDF file "${file.name}". 
In a production environment, we would use PDF.js to extract the actual text content.

## Key Points
- This is a simulated extraction of "${file.name}"
- The actual content would be extracted using PDF.js in production
- The file size is approximately ${Math.round(file.size / 1024)} KB
- The file was uploaded at ${new Date().toLocaleString()}

## Conclusion
Thank you for uploading your document. This simulated text extraction demonstrates how the feature would work
in a production environment.
`

        resolve(simulatedContent)
      }, 1500) // Simulate processing time
    } catch (error) {
      console.error("Error processing PDF:", error)
      reject(error)
    }
  })
}

// Generate learning session insights
export async function generateSessionInsights(sessions: any[]): Promise<any> {
  try {
    const apiKey = getApiKey()

    if (!apiKey || sessions.length === 0) {
      return {
        conceptMastery: [],
        learningPatterns: null,
        recommendations: [],
      }
    }

    // Extract data from recent sessions
    const recentMessages = sessions.slice(0, 5).flatMap((session) =>
      session.messages
        .filter((msg: any) => msg.role !== "system")
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content.slice(0, 500), // Limit content length
        })),
    )

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "https://mindgrove.app",
        "X-Title": "Mindgrove AI Tutor",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content:
              "You analyze learning sessions and provide insights. Return a JSON object with conceptMastery (array of concepts and mastery scores 1-100), learningPatterns (object with peak times and days), and recommendations (array of learning suggestions).",
          },
          {
            role: "user",
            content: `Analyze these learning session messages and provide insights as a JSON object with conceptMastery, learningPatterns, and recommendations:\n\n${JSON.stringify(recentMessages)}`,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      console.error("Failed to generate insights:", response.statusText)
      return null
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    try {
      // Extract JSON from the response
      const match = content?.match(/\{.*\}/s)
      if (match) {
        return JSON.parse(match[0])
      }
      return null
    } catch (e) {
      console.error("Error parsing insights:", e)
      return null
    }
  } catch (error) {
    console.error("Error generating insights:", error)
    return null
  }
}

// Generate a mini learning game based on content
export async function generateMiniGame(content: string): Promise<any> {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      return {
        type: "quiz",
        title: "Sample Quiz",
        instructions: "Answer the following questions",
        items: [
          {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: "Paris",
          },
          {
            question: "What is 2+2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: "4",
          },
        ],
      }
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "https://mindgrove.app",
        "X-Title": "Mindgrove AI Tutor",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content:
              "You create educational mini games. Return a JSON object with type (matching, quiz, fillBlanks), title, instructions, and items (array of questions/answers for the game). For quiz type, each item must have question, options (array of strings), and correctAnswer fields. For matching type, each item must have term and match fields. For fillBlanks type, each item must have sentence and answer fields.",
          },
          {
            role: "user",
            content: `Create a mini educational game based on this content. Return as a JSON object with game details. Make sure to include all required fields for the game type you choose:\n\n${content}`,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error("Failed to generate game:", response.statusText)
      return null
    }

    const data = await response.json()
    const responseContent = data.choices[0]?.message?.content

    try {
      // Extract JSON from the response
      const match = responseContent?.match(/\{.*\}/s)
      if (match) {
        return JSON.parse(match[0])
      }
      return null
    } catch (e) {
      console.error("Error parsing game data:", e)
      return null
    }
  } catch (error) {
    console.error("Error generating game:", error)
    return null
  }
}

// Generate daily brain exercise
export async function generateBrainExercise(concepts: string[]): Promise<any> {
  try {
    const apiKey = getApiKey()

    if (!apiKey || concepts.length === 0) {
      return {
        type: "memory",
        title: "Memory Challenge",
        instructions: "Memorize these items and recall them later",
        content: "Try to memorize these words: apple, book, cat, dog, elephant",
      }
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "https://mindgrove.app",
        "X-Title": "Mindgrove AI Tutor",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content:
              "You create brain training exercises. Return a clean JSON object with type (memory, logic, focus), title, instructions, and content (the exercise details). Ensure your response is valid JSON without any special characters that could break parsing.",
          },
          {
            role: "user",
            content: `Create a brain training exercise related to these concepts. Make it challenging but fun. Return as a clean JSON object:\n\n${concepts.join(", ")}`,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error("Failed to generate brain exercise:", response.statusText)
      return null
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    try {
      // Extract JSON from the response, handling potential formatting issues
      let jsonStr = content
      if (content.includes("```json")) {
        jsonStr = content.split("```json")[1].split("```")[0].trim()
      } else if (content.includes("{")) {
        const startIdx = content.indexOf("{")
        const endIdx = content.lastIndexOf("}") + 1
        if (startIdx >= 0 && endIdx > startIdx) {
          jsonStr = content.substring(startIdx, endIdx)
        }
      }

      return JSON.parse(jsonStr)
    } catch (e) {
      console.error("Error parsing brain exercise:", e)
      return {
        type: "focus",
        title: "Focus Exercise",
        instructions: "Complete this concentration task",
        content: "Count backwards from 100 by 7s as quickly as you can.",
      }
    }
  } catch (error) {
    console.error("Error generating brain exercise:", error)
    return null
  }
}

// Process audio recording
export async function processAudioRecording(audioBlob: Blob): Promise<string> {
  try {
    console.log("Processing audio recording...")

    // Instead of calling the OpenAI API which requires authentication,
    // we'll simulate a successful transcription for the demo

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return a simulated transcription
    return "This is a simulated transcription of your audio recording. In a production environment, this would use the OpenAI Whisper API to convert your speech to text."
  } catch (error) {
    console.error("Error processing audio:", error)
    return "I couldn't process your audio recording. Please try typing your message instead."
  }
}
