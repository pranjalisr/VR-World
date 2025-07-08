"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VRInterface from "@/components/vr-interface"
import ContentLibrary from "@/components/content-library"
import UserDashboard from "@/components/user-dashboard"
import { Eye, Database, Server, Cpu } from "lucide-react"

interface User {
  id: number
  email: string
  username: string
}

interface VRContent {
  id: number
  title: string
  description: string
  environment_type: string
  thumbnail_url: string
  difficulty_level: string
  duration_minutes: number
}

export default function VRExperienceApp() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedContent, setSelectedContent] = useState<VRContent | null>(null)
  const [activeTab, setActiveTab] = useState("login")
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in (in a real app, check JWT token)
    const savedUser = localStorage.getItem("vr_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setActiveTab("library")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem("vr_user", JSON.stringify(data.user))
        setActiveTab("library")
      } else {
        alert("Login failed: " + data.error)
      }
    } catch (error) {
      alert("Login failed: Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedContent(null)
    localStorage.removeItem("vr_user")
    setActiveTab("login")
  }

  const handleSelectContent = (content: VRContent) => {
    setSelectedContent(content)
    setActiveTab("vr-experience")
  }

  const handleInteraction = async (interaction: any) => {
    if (!user || !selectedContent) return

    try {
      await fetch("/api/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          content_id: selectedContent.id,
          session_id: `session_${Date.now()}`,
          interaction_type: interaction.type,
          interaction_data: interaction,
          position_data: interaction.position || null,
        }),
      })
    } catch (error) {
      console.error("Failed to record interaction:", error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Immersive Reality Hub</h1>
              <p className="text-purple-200 text-lg">Step into worlds beyond imagination</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-purple-200 rounded-xl h-12 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-purple-200 rounded-xl h-12 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Entering Reality...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Enter VR World
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <p className="text-sm text-blue-200 font-medium">Demo Access Available</p>
              </div>
              <div className="text-xs text-blue-100 space-y-1">
                <p>
                  <span className="font-medium">Email:</span> name@gmail.com
                </p>
                <p>
                  <span className="font-medium">Password:</span> demo123
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                Experience cutting-edge VR technology with realistic human interactions
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 min-h-screen">
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 shadow-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Immersive Reality Hub</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-purple-200 text-sm">
                <span className="hidden sm:inline">Welcome back, </span>
                <span className="font-medium text-white">{user.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-purple-400/50 text-purple-200 hover:bg-purple-500/20 hover:text-white rounded-lg bg-transparent"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="library">
              <Database className="w-4 h-4 mr-2" />
              Content Library
            </TabsTrigger>
            <TabsTrigger value="vr-experience" disabled={!selectedContent}>
              <Eye className="w-4 h-4 mr-2" />
              VR Experience
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <Cpu className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tech-stack">
              <Server className="w-4 h-4 mr-2" />
              Tech Stack
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Interactive Learning Experiences</h2>
                <p className="text-gray-600">
                  Learn from real experts, interact with lifelike environments, and engage in authentic human
                  connections
                </p>
              </div>
              <ContentLibrary onSelectContent={handleSelectContent} />
            </div>
          </TabsContent>

          <TabsContent value="vr-experience">
            {selectedContent ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedContent.title}</h2>
                    <p className="text-gray-600">{selectedContent.description}</p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab("library")}>
                    Back to Library
                  </Button>
                </div>
                <div className="h-[600px] rounded-lg overflow-hidden border">
                  <VRInterface environmentType={selectedContent.environment_type} onInteraction={handleInteraction} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Select a VR experience from the library to begin</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard">
            <UserDashboard userId={user.id} />
          </TabsContent>

          <TabsContent value="tech-stack">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Technology Stack</h2>
                <p className="text-gray-600">Built with modern web technologies for immersive VR experiences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Database className="w-8 h-8 text-blue-600 mb-2" />
                    <CardTitle>MongoDB Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• VR content storage</li>
                      <li>• User preferences</li>
                      <li>• Interaction data</li>
                      <li>• Session tracking</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Server className="w-8 h-8 text-green-600 mb-2" />
                    <CardTitle>Express.js APIs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• User authentication</li>
                      <li>• Content management</li>
                      <li>• Preference handling</li>
                      <li>• Interaction logging</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Eye className="w-8 h-8 text-purple-600 mb-2" />
                    <CardTitle>React VR Interface</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Three.js integration</li>
                      <li>• Interactive 3D scenes</li>
                      <li>• Real-time rendering</li>
                      <li>• User interactions</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Cpu className="w-8 h-8 text-orange-600 mb-2" />
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Personalized experiences</li>
                      <li>• Multiple environments</li>
                      <li>• User analytics</li>
                      <li>• Responsive design</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Database Schema Overview</CardTitle>
                  <CardDescription>Designed for scalable VR content and user management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Core Tables:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>
                          • <strong>users</strong> - Authentication & profiles
                        </li>
                        <li>
                          • <strong>vr_content</strong> - VR environments & assets
                        </li>
                        <li>
                          • <strong>user_preferences</strong> - Personalization settings
                        </li>
                        <li>
                          • <strong>interaction_data</strong> - User interaction tracking
                        </li>
                        <li>
                          • <strong>user_sessions</strong> - Session management
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• JSONB for flexible data storage</li>
                        <li>• Foreign key relationships</li>
                        <li>• Timestamp tracking</li>
                        <li>• Scalable architecture</li>
                        <li>• Performance optimized</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
