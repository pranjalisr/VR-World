"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Activity, User, BarChart3 } from "lucide-react"

interface UserPreferences {
  preferred_environments: string[]
  comfort_settings: {
    motion_sickness_reduction: boolean
    teleport_movement: boolean
    comfort_vignetting: boolean
  }
  audio_preferences: {
    master_volume: number
    spatial_audio: boolean
    ambient_sounds: boolean
  }
  visual_preferences: {
    brightness: number
    contrast: number
    field_of_view: number
  }
}

interface UserDashboardProps {
  userId: number
}

export default function UserDashboard({ userId }: UserDashboardProps) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [userId])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user-preferences?user_id=${userId}`)
      const data = await response.json()

      if (data.success) {
        setPreferences(data.preferences)
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    if (!preferences) return

    try {
      setSaving(true)
      const response = await fetch("/api/user-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          preferences,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Show success message
        console.log("Preferences saved successfully")
      }
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const updatePreferences = (section: string, key: string, value: any) => {
    if (!preferences) return

    setPreferences((prev) => ({
      ...prev!,
      [section]: {
        ...prev![section as keyof UserPreferences],
        [key]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!preferences) {
    return <div>Failed to load preferences</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        <Button onClick={savePreferences} disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preferences">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comfort Settings</CardTitle>
              <CardDescription>Adjust settings to reduce motion sickness and improve comfort</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="motion-sickness">Motion Sickness Reduction</Label>
                <Switch
                  id="motion-sickness"
                  checked={preferences.comfort_settings.motion_sickness_reduction}
                  onCheckedChange={(checked) =>
                    updatePreferences("comfort_settings", "motion_sickness_reduction", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="teleport">Teleport Movement</Label>
                <Switch
                  id="teleport"
                  checked={preferences.comfort_settings.teleport_movement}
                  onCheckedChange={(checked) => updatePreferences("comfort_settings", "teleport_movement", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="vignetting">Comfort Vignetting</Label>
                <Switch
                  id="vignetting"
                  checked={preferences.comfort_settings.comfort_vignetting}
                  onCheckedChange={(checked) => updatePreferences("comfort_settings", "comfort_vignetting", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audio Settings</CardTitle>
              <CardDescription>Configure audio preferences for immersive experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Master Volume: {Math.round(preferences.audio_preferences.master_volume * 100)}%</Label>
                <Slider
                  value={[preferences.audio_preferences.master_volume]}
                  onValueChange={([value]) => updatePreferences("audio_preferences", "master_volume", value)}
                  max={1}
                  min={0}
                  step={0.1}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="spatial-audio">Spatial Audio</Label>
                <Switch
                  id="spatial-audio"
                  checked={preferences.audio_preferences.spatial_audio}
                  onCheckedChange={(checked) => updatePreferences("audio_preferences", "spatial_audio", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ambient-sounds">Ambient Sounds</Label>
                <Switch
                  id="ambient-sounds"
                  checked={preferences.audio_preferences.ambient_sounds}
                  onCheckedChange={(checked) => updatePreferences("audio_preferences", "ambient_sounds", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>Adjust visual settings for optimal viewing experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Brightness: {Math.round(preferences.visual_preferences.brightness * 100)}%</Label>
                <Slider
                  value={[preferences.visual_preferences.brightness]}
                  onValueChange={([value]) => updatePreferences("visual_preferences", "brightness", value)}
                  max={1}
                  min={0}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Contrast: {Math.round(preferences.visual_preferences.contrast * 100)}%</Label>
                <Slider
                  value={[preferences.visual_preferences.contrast]}
                  onValueChange={([value]) => updatePreferences("visual_preferences", "contrast", value)}
                  max={1}
                  min={0}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Field of View: {preferences.visual_preferences.field_of_view}°</Label>
                <Slider
                  value={[preferences.visual_preferences.field_of_view]}
                  onValueChange={([value]) => updatePreferences("visual_preferences", "field_of_view", value)}
                  max={120}
                  min={60}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your VR session history and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Ocean Depths Explorer</p>
                    <p className="text-sm text-gray-600">Completed • 15 minutes</p>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Space Station Adventure</p>
                    <p className="text-sm text-gray-600">In Progress • 8/25 minutes</p>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Ancient Forest Journey</p>
                    <p className="text-sm text-gray-600">Completed • 20 minutes</p>
                  </div>
                  <div className="text-sm text-gray-500">3 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <p className="text-sm text-gray-600 mt-1">john_doe</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600 mt-1">john@example.com</p>
                </div>
                <div>
                  <Label>Member Since</Label>
                  <p className="text-sm text-gray-600 mt-1">January 2024</p>
                </div>
                <div>
                  <Label>Total VR Time</Label>
                  <p className="text-sm text-gray-600 mt-1">12 hours 45 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Insights into your VR experience patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Favorite Environment</h4>
                  <p className="text-2xl font-bold text-blue-600">🌊 Underwater</p>
                  <p className="text-sm text-gray-600">65% of total time</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Average Session</h4>
                  <p className="text-2xl font-bold text-green-600">18 min</p>
                  <p className="text-sm text-gray-600">+2 min from last week</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Interactions/Session</h4>
                  <p className="text-2xl font-bold text-purple-600">47</p>
                  <p className="text-sm text-gray-600">Above average</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Completion Rate</h4>
                  <p className="text-2xl font-bold text-orange-600">89%</p>
                  <p className="text-sm text-gray-600">Excellent engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
