"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface FallbackProps {
  title?: string
  description?: string
  error?: Error | string
  onRetry?: () => void
}

export function Fallback({
  title = "Something went wrong",
  description = "There was an error loading this content. Please try again.",
  error,
  onRetry,
}: FallbackProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {error && (
        <CardContent>
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium text-muted-foreground">{typeof error === "string" ? error : error.message}</p>
          </div>
        </CardContent>
      )}
      {onRetry && (
        <CardFooter>
          <Button onClick={onRetry} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
