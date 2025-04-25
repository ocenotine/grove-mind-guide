import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Message } from "./api"

// Define types
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  streak: number
  lastActive: number
  preferences: {
    theme: string
    notifications: boolean
    sound: boolean
    language: string
  }
  achievements: Achievement[]
  interests: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number | null
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  isActive: boolean
}

export interface Flashcard {
  id: string
  front: string
  back: string
  tags: string[]
  createdAt: number
  lastReviewed: number | null
  proficiency: number // 0-5 scale
}

export interface Document {
  id: string
  title: string
  type: string
  url: string
  summary: string | null
  uploadedAt: number
  tags: string[]
}

export interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "challenge"
  progress: number
  goal: number
  completed: boolean
  reward: {
    xp: number
    item: string | null
  }
  expiresAt: number | null
}

export interface MiniGame {
  id: string
  title: string
  type: "quiz" | "matching" | "fillBlanks"
  topic: string
  questions: GameQuestion[]
  completed: boolean
  score: number | null
}

export interface GameQuestion {
  id: string
  question: string
  options?: string[]
  answer: string | string[]
  userAnswer?: string | string[]
  isCorrect?: boolean
}

export interface DailyChallenge {
  id: string
  question: string
  options: string[]
  answer: string
  explanation: string
  completed: boolean
  userAnswer: string | null
  date: number
}

interface StoreState {
  user: User
  chatSessions: ChatSession[]
  activeChatSession: string | null
  flashcards: Flashcard[]
  documents: Document[]
  quests: Quest[]
  miniGames: MiniGame[]
  dailyChallenge: DailyChallenge | null
  isOnboarded: boolean

  // Actions
  setUser: (user: Partial<User>) => void
  createChatSession: () => string
  setChatSessions: (sessions: ChatSession[]) => void
  setActiveChatSession: (sessionId: string | null) => void
  addMessageToSession: (sessionId: string, message: Omit<Message, "id">) => string
  updateChatSessionTitle: (sessionId: string, title: string) => void
  deleteChatSession: (sessionId: string) => void
  closeChatSession: (sessionId: string) => void
  setFlashcards: (flashcards: Flashcard[]) => void
  addFlashcard: (flashcard: Omit<Flashcard, "id" | "createdAt" | "lastReviewed" | "proficiency">) => string
  updateFlashcard: (id: string, flashcard: Partial<Flashcard>) => void
  deleteFlashcard: (id: string) => void
  setDocuments: (documents: Document[]) => void
  addDocument: (document: Omit<Document, "id" | "uploadedAt">) => string
  deleteDocument: (id: string) => void
  setQuests: (quests: Quest[]) => void
  updateQuestProgress: (id: string, progress: number) => void
  setMiniGames: (games: MiniGame[]) => void
  updateMiniGameScore: (id: string, score: number, answers: Record<string, string | string[]>) => void
  setDailyChallenge: (challenge: DailyChallenge | null) => void
  completeDailyChallenge: (answer: string) => void
  resetDailyChallenge: () => void
  setOnboarded: (value: boolean) => void
}

// Create store with persistence
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: {
        id: uuidv4(),
        name: "User",
        email: "",
        avatar: "/placeholder.svg?height=40&width=40",
        level: 1,
        xp: 0,
        streak: 0,
        lastActive: Date.now(),
        preferences: {
          theme: "system",
          notifications: true,
          sound: true,
          language: "en",
        },
        achievements: [],
        interests: [],
      },
      chatSessions: [],
      activeChatSession: null,
      flashcards: [],
      documents: [],
      quests: [
        {
          id: uuidv4(),
          title: "Complete your first chat",
          description: "Start a conversation with Mindgrove AI",
          type: "daily",
          progress: 0,
          goal: 1,
          completed: false,
          reward: {
            xp: 50,
            item: null,
          },
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        },
        {
          id: uuidv4(),
          title: "Create 3 flashcards",
          description: "Create flashcards to help you study",
          type: "daily",
          progress: 0,
          goal: 3,
          completed: false,
          reward: {
            xp: 75,
            item: null,
          },
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        },
        {
          id: uuidv4(),
          title: "Complete a mini-game",
          description: "Play and complete any mini-game",
          type: "weekly",
          progress: 0,
          goal: 1,
          completed: false,
          reward: {
            xp: 100,
            item: "theme-galaxy",
          },
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
      ],
      miniGames: [
        {
          id: uuidv4(),
          title: "General Knowledge Quiz",
          type: "quiz",
          topic: "General Knowledge",
          questions: [
            {
              id: uuidv4(),
              question: "What is the capital of France?",
              options: ["London", "Berlin", "Paris", "Madrid"],
              answer: "Paris",
            },
            {
              id: uuidv4(),
              question: 'Who wrote "Romeo and Juliet"?',
              options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
              answer: "William Shakespeare",
            },
            {
              id: uuidv4(),
              question: "What is the chemical symbol for gold?",
              options: ["Go", "Gd", "Au", "Ag"],
              answer: "Au",
            },
          ],
          completed: false,
          score: null,
        },
        {
          id: uuidv4(),
          title: "Math Concepts",
          type: "matching",
          topic: "Mathematics",
          questions: [
            {
              id: uuidv4(),
              question: "Pythagorean Theorem",
              answer: "a² + b² = c²",
            },
            {
              id: uuidv4(),
              question: "Area of a Circle",
              answer: "πr²",
            },
            {
              id: uuidv4(),
              question: "Quadratic Formula",
              answer: "x = (-b ± √(b² - 4ac)) / 2a",
            },
          ],
          completed: false,
          score: null,
        },
        {
          id: uuidv4(),
          title: "Science Terms",
          type: "fillBlanks",
          topic: "Science",
          questions: [
            {
              id: uuidv4(),
              question: "The process by which plants make food using sunlight is called ___.",
              answer: "photosynthesis",
            },
            {
              id: uuidv4(),
              question: "The smallest unit of an element that maintains its chemical properties is called an ___.",
              answer: "atom",
            },
            {
              id: uuidv4(),
              question: "The force that attracts objects toward the center of the Earth is called ___.",
              answer: "gravity",
            },
          ],
          completed: false,
          score: null,
        },
      ],
      dailyChallenge: {
        id: uuidv4(),
        question: "What is the main function of mitochondria in a cell?",
        options: ["Cell division", "Protein synthesis", "Energy production", "Waste removal"],
        answer: "Energy production",
        explanation:
          'Mitochondria are often referred to as the "powerhouse of the cell" because they generate most of the cell\'s supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.',
        completed: false,
        userAnswer: null,
        date: new Date().setHours(0, 0, 0, 0),
      },
      isOnboarded: false,

      // Actions
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      createChatSession: () => {
        const id = uuidv4()
        const now = Date.now()

        set((state) => {
          // First, mark all sessions as inactive
          const updatedSessions = state.chatSessions.map((session) => ({
            ...session,
            isActive: false,
          }))

          // Create new session
          const newSession: ChatSession = {
            id,
            title: "New Chat",
            messages: [
              {
                id: uuidv4(),
                role: "system",
                content:
                  "You are Mindgrove, an AI tutor and research assistant. You help users learn and understand complex topics.",
                timestamp: now,
              },
            ],
            createdAt: now,
            updatedAt: now,
            isActive: true,
          }

          return {
            chatSessions: [...updatedSessions, newSession],
            activeChatSession: id,
          }
        })

        return id
      },

      setChatSessions: (sessions) => set({ chatSessions: sessions }),

      setActiveChatSession: (sessionId) => {
        set((state) => {
          // Mark all sessions as inactive first
          const updatedSessions = state.chatSessions.map((session) => ({
            ...session,
            isActive: session.id === sessionId,
          }))

          return {
            chatSessions: updatedSessions,
            activeChatSession: sessionId,
          }
        })
      },

      addMessageToSession: (sessionId, message) => {
        const id = uuidv4()
        const timestamp = Date.now()

        set((state) => {
          const updatedSessions = state.chatSessions.map((session) => {
            if (session.id === sessionId) {
              // Check if there's a system message
              const hasSystemMessage = session.messages.some((msg) => msg.role === "system")

              // Prepare messages array
              let updatedMessages = [...session.messages]

              // Add system message if none exists
              if (!hasSystemMessage) {
                updatedMessages = [
                  {
                    id: uuidv4(),
                    role: "system",
                    content:
                      "You are Mindgrove, an AI tutor and research assistant. You help users learn and understand complex topics.",
                    timestamp,
                  },
                  ...updatedMessages,
                ]
              }

              // Add the new message
              updatedMessages.push({
                ...message,
                id,
                timestamp,
              })

              return {
                ...session,
                messages: updatedMessages,
                updatedAt: timestamp,
              }
            }
            return session
          })

          return { chatSessions: updatedSessions }
        })

        return id
      },

      updateChatSessionTitle: (sessionId, title) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((session) =>
            session.id === sessionId ? { ...session, title } : session,
          ),
        })),

      deleteChatSession: (sessionId) =>
        set((state) => {
          const updatedSessions = state.chatSessions.filter((session) => session.id !== sessionId)
          const activeSession = state.activeChatSession === sessionId ? null : state.activeChatSession

          return {
            chatSessions: updatedSessions,
            activeChatSession: activeSession,
          }
        }),

      closeChatSession: (sessionId) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((session) =>
            session.id === sessionId ? { ...session, isActive: false } : session,
          ),
          activeChatSession: state.activeChatSession === sessionId ? null : state.activeChatSession,
        })),

      setFlashcards: (flashcards) => set({ flashcards }),

      addFlashcard: (flashcard) => {
        const id = uuidv4()
        set((state) => ({
          flashcards: [
            ...state.flashcards,
            {
              ...flashcard,
              id,
              createdAt: Date.now(),
              lastReviewed: null,
              proficiency: 0,
            },
          ],
        }))
        return id
      },

      updateFlashcard: (id, flashcard) =>
        set((state) => ({
          flashcards: state.flashcards.map((card) => (card.id === id ? { ...card, ...flashcard } : card)),
        })),

      deleteFlashcard: (id) =>
        set((state) => ({
          flashcards: state.flashcards.filter((card) => card.id !== id),
        })),

      setDocuments: (documents) => set({ documents }),

      addDocument: (document) => {
        const id = uuidv4()
        set((state) => ({
          documents: [
            ...state.documents,
            {
              ...document,
              id,
              uploadedAt: Date.now(),
            },
          ],
        }))
        return id
      },

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),

      setQuests: (quests) => set({ quests }),

      updateQuestProgress: (id, progress) =>
        set((state) => {
          const updatedQuests = state.quests.map((quest) => {
            if (quest.id === id) {
              const newProgress = Math.min(quest.goal, progress)
              const completed = newProgress >= quest.goal

              // If newly completed, add XP to user
              let user = { ...state.user }
              if (completed && !quest.completed) {
                user = {
                  ...user,
                  xp: user.xp + quest.reward.xp,
                }
              }

              return {
                ...quest,
                progress: newProgress,
                completed,
              }
            }
            return quest
          })

          return {
            quests: updatedQuests,
            user: state.user,
          }
        }),

      setMiniGames: (games) => set({ miniGames: games }),

      updateMiniGameScore: (id, score, answers) =>
        set((state) => {
          const updatedGames = state.miniGames.map((game) => {
            if (game.id === id) {
              const updatedQuestions = game.questions.map((q) => {
                const userAnswer = answers[q.id]
                let isCorrect = false

                if (Array.isArray(q.answer) && Array.isArray(userAnswer)) {
                  isCorrect = q.answer.every((a) => userAnswer.includes(a)) && userAnswer.length === q.answer.length
                } else {
                  isCorrect = q.answer === userAnswer
                }

                return {
                  ...q,
                  userAnswer,
                  isCorrect,
                }
              })

              return {
                ...game,
                questions: updatedQuestions,
                completed: true,
                score,
              }
            }
            return game
          })

          // Update quest progress for completing a mini-game
          const miniGameQuest = state.quests.find((q) => q.title.includes("mini-game") && !q.completed)

          let updatedQuests = state.quests
          if (miniGameQuest) {
            updatedQuests = state.quests.map((quest) => {
              if (quest.id === miniGameQuest.id) {
                return {
                  ...quest,
                  progress: quest.goal,
                  completed: true,
                }
              }
              return quest
            })
          }

          // Add XP to user
          const user = {
            ...state.user,
            xp: state.user.xp + score * 10, // 10 XP per correct answer
          }

          return {
            miniGames: updatedGames,
            quests: updatedQuests,
            user,
          }
        }),

      setDailyChallenge: (challenge) => set({ dailyChallenge: challenge }),

      completeDailyChallenge: (answer) =>
        set((state) => {
          if (!state.dailyChallenge) return state

          const isCorrect = state.dailyChallenge.answer === answer
          const xpGained = isCorrect ? 50 : 10 // 50 XP for correct, 10 for trying

          // Update user XP
          const user = {
            ...state.user,
            xp: state.user.xp + xpGained,
          }

          return {
            dailyChallenge: {
              ...state.dailyChallenge,
              completed: true,
              userAnswer: answer,
            },
            user,
          }
        }),

      resetDailyChallenge: () =>
        set((state) => {
          // Only reset if it's a new day
          const today = new Date().setHours(0, 0, 0, 0)
          if (state.dailyChallenge && state.dailyChallenge.date === today) {
            return state
          }

          // Generate a new challenge
          const challenges = [
            {
              question: "Which planet is known as the Red Planet?",
              options: ["Venus", "Mars", "Jupiter", "Saturn"],
              answer: "Mars",
              explanation:
                "Mars is often called the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface.",
            },
            {
              question: "What is the largest organ in the human body?",
              options: ["Heart", "Liver", "Skin", "Brain"],
              answer: "Skin",
              explanation:
                "The skin is the largest organ of the human body, covering an area of about 2 square meters in adults.",
            },
            {
              question: 'Which element has the chemical symbol "O"?',
              options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
              answer: "Oxygen",
              explanation:
                'Oxygen is represented by the chemical symbol "O" on the periodic table. It\'s essential for respiration in many organisms.',
            },
          ]

          const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]

          return {
            dailyChallenge: {
              id: uuidv4(),
              ...randomChallenge,
              completed: false,
              userAnswer: null,
              date: today,
            },
          }
        }),

      setOnboarded: (value) => set({ isOnboarded: value }),
    }),
    {
      name: "mindgrove-storage",
    },
  ),
)
