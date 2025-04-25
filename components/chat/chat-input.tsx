"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Send, Paperclip, Mic, StopCircle, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { processAudioRecording } from "@/lib/api"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  onFileUpload?: (file: File) => void
  isProcessingFile?: boolean
}

export function ChatInput({ onSendMessage, isLoading, onFileUpload, isProcessingFile }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileUpload) {
      onFileUpload(file)
      e.target.value = "" // Reset input
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        // Process the audio recording
        setIsProcessingAudio(true)
        try {
          const transcription = await processAudioRecording(audioBlob)
          setMessage(transcription)

          // Trigger haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(100)
          }
        } catch (error) {
          console.error("Error processing audio:", error)
          toast({
            title: "Error",
            description: "Failed to process audio recording",
            variant: "destructive",
          })
        } finally {
          setIsProcessingAudio(false)
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      let seconds = 0
      recordingTimerRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)

        // Auto-stop after 60 seconds
        if (seconds >= 60) {
          stopRecording()
        }
      }, 1000)

      // Trigger haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50])
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
        setRecordingTime(0)
      }
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
        setRecordingTime(0)
      }

      // Clear audio chunks
      audioChunksRef.current = []
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isRecording || isProcessingAudio || isProcessingFile}
            className="min-h-[60px] resize-none pr-12 pt-4"
            rows={1}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            {onFileUpload && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    disabled={isLoading || isRecording || isProcessingAudio || isProcessingFile}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="end" className="w-72 p-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">Upload a file</h3>
                    <p className="text-xs text-muted-foreground">
                      Upload a PDF or text file to analyze and create flashcards
                    </p>
                    <div className="flex justify-end">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.txt"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isLoading || isProcessingFile}
                        />
                        <Button size="sm" disabled={isLoading || isProcessingFile}>
                          {isProcessingFile ? "Processing..." : "Select File"}
                        </Button>
                      </label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        {isRecording ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 dark:bg-red-900/30">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
              <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full border-red-200 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30"
              onClick={stopRecording}
            >
              <StopCircle className="h-5 w-5 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelRecording}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full"
              onClick={startRecording}
              disabled={isLoading || isProcessingAudio || isProcessingFile}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading || isProcessingAudio || isProcessingFile}
            >
              <Send className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      {isProcessingAudio && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm">Processing audio...</span>
          </div>
        </div>
      )}
    </div>
  )
}
