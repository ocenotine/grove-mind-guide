// Session and messages
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  isLoading?: boolean
  isError?: boolean
}

export interface Session {
  id: string
  title: string
  messages: Message[]
}

// Flashcards
export interface Flashcard {
  id: string
  front: string
  back: string
  tags: string[]
  createdAt: string
}

// Documents
export interface Document {
  id: string
  name: string
  type: string
  size: number
  pages: number
  uploadedAt: string
  content: string
}

// Settings
export interface Settings {
  displayName: string
  email: string
  theme: string
  fontSize: string
  notifications: boolean
  streakReminders: boolean
  reducedMotion: boolean
  highContrast: boolean
  aiModel: string
  temperature: number
  streamResponses: boolean
  apiKey: string
  interests: string[]
  onboardingCompleted: boolean
}
