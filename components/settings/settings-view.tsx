"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export function SettingsView() {
  const { user, setUser } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    if (user?.apiKey) {
      setApiKey(user.apiKey)
    }
  }, [user])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Save settings to database
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update user in store
      setUser({
        ...user,
        apiKey,
        theme: user?.theme || "system",
        notifications: user?.notifications !== false,
        soundEffects: user?.soundEffects !== false,
        autoSave: user?.autoSave !== false,
        fontSize: user?.fontSize || "medium",
        language: user?.language || "english",
      })

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (theme: string) => {
    setUser({
      ...user,
      theme,
    })
  }

  const handleToggleChange = (key: string, value: boolean) => {
    setUser({
      ...user,
      [key]: value,
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about your learning progress</p>
                </div>
                <Switch
                  id="notifications"
                  checked={user?.notifications !== false}
                  onCheckedChange={(checked) => handleToggleChange("notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="soundEffects">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Play sound effects for interactions</p>
                </div>
                <Switch
                  id="soundEffects"
                  checked={user?.soundEffects !== false}
                  onCheckedChange={(checked) => handleToggleChange("soundEffects", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave">Auto Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your progress</p>
                </div>
                <Switch
                  id="autoSave"
                  checked={user?.autoSave !== false}
                  onCheckedChange={(checked) => handleToggleChange("autoSave", checked)}
                />
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={user?.language || "english"}
                  onValueChange={(value) => setUser({ ...user, language: value })}
                >
                  <SelectTrigger id="language" className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={user?.theme || "system"} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme" className="mt-1">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={user?.fontSize || "medium"}
                  onValueChange={(value) => setUser({ ...user, fontSize: value })}
                >
                  <SelectTrigger id="fontSize" className="mt-1">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account and API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your API key"
                />
                <p className="text-sm text-muted-foreground mt-1">Your API key is used to access external services</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
