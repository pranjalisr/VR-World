"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Play } from "lucide-react"

interface VRContent {
  id: number
  title: string
  description: string
  environment_type: string
  content_url: string
  thumbnail_url: string
  difficulty_level: string
  duration_minutes: number
}

interface ContentLibraryProps {
  onSelectContent: (content: VRContent) => void
}

export default function ContentLibrary({ onSelectContent }: ContentLibraryProps) {
  const [content, setContent] = useState<VRContent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  const mockVRContent = [
    {
      id: 1,
      title: "Marine Biology Research Station",
      description:
        "Join Dr. Marina and her research team as they study coral reef ecosystems. Interact with marine life, collect data, and learn about ocean conservation from real marine biologists.",
      environment_type: "underwater",
      content_url: "/vr/ocean-depths",
      thumbnail_url: "/placeholder.svg?height=200&width=300",
      difficulty_level: "beginner",
      duration_minutes: 25,
    },
    {
      id: 2,
      title: "International Space Station Mission",
      description:
        "Work alongside Commander Alex and the ISS crew. Experience daily life in zero gravity, conduct scientific experiments, and communicate with mission control on Earth.",
      environment_type: "space",
      content_url: "/vr/space-station",
      thumbnail_url: "/placeholder.svg?height=200&width=300",
      difficulty_level: "intermediate",
      duration_minutes: 35,
    },
    {
      id: 3,
      title: "Forest Conservation Experience",
      description:
        "Partner with Ranger Sarah to protect endangered wildlife habitats. Track animals, study their behaviors, and learn about sustainable forest management practices.",
      environment_type: "forest",
      content_url: "/vr/ancient-forest",
      thumbnail_url: "/placeholder.svg?height=200&width=300",
      difficulty_level: "beginner",
      duration_minutes: 30,
    },
    {
      id: 4,
      title: "Urban Planning Simulation",
      description:
        "Collaborate with city planners and architects to design sustainable smart cities. Meet with community members and balance environmental, social, and economic needs.",
      environment_type: "urban",
      content_url: "/vr/cyberpunk-city",
      thumbnail_url: "/placeholder.svg?height=200&width=300",
      difficulty_level: "advanced",
      duration_minutes: 45,
    },
    {
      id: 5,
      title: "Himalayan Expedition Base Camp",
      description:
        "Join mountaineer Captain Rodriguez and his team at Everest Base Camp. Learn high-altitude survival skills, weather prediction, and experience the challenges of extreme mountain climbing.",
      environment_type: "mountain",
      content_url: "/vr/mountain-climb",
      thumbnail_url: "/placeholder.svg?height=200&width=300",
      difficulty_level: "advanced",
      duration_minutes: 50,
    },
    {
      id: 6,
      title: "Archaeological Discovery Site",
      description:
        "Work with Dr. Thompson and her archaeology team to uncover ancient civilizations. Use authentic excavation tools, analyze artifacts, and piece together historical mysteries.",
      environment_type: "archaeological",
      content_url: "/vr/ancient-ruins",
      thumbnail_url: "/placeholder.svg?height=200&width=300",
      difficulty_level: "intermediate",
      duration_minutes: 40,
    },
  ]

  useEffect(() => {
    fetchContent()
  }, [filter])

  const fetchContent = async () => {
    try {
      setLoading(true)
      // const params = filter !== "all" ? `?environment_type=${filter}` : ""
      // const response = await fetch(`/api/vr-content${params}`)
      // const data = await response.json()

      // if (data.success) {
      //   setContent(data.content)
      // }
      setContent(filter === "all" ? mockVRContent : mockVRContent.filter((item) => item.environment_type === filter))
    } catch (error) {
      console.error("Failed to fetch content:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case "underwater":
        return "🌊"
      case "space":
        return "🚀"
      case "forest":
        return "🌲"
      case "urban":
        return "🏙️"
      case "mountain":
        return "⛰️"
      case "archaeological":
        return "🏛️"
      default:
        return "🎮"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
          All Environments
        </Button>
        <Button
          variant={filter === "underwater" ? "default" : "outline"}
          onClick={() => setFilter("underwater")}
          size="sm"
        >
          🌊 Underwater
        </Button>
        <Button variant={filter === "space" ? "default" : "outline"} onClick={() => setFilter("space")} size="sm">
          🚀 Space
        </Button>
        <Button variant={filter === "forest" ? "default" : "outline"} onClick={() => setFilter("forest")} size="sm">
          🌲 Forest
        </Button>
        <Button variant={filter === "urban" ? "default" : "outline"} onClick={() => setFilter("urban")} size="sm">
          🏙️ Urban
        </Button>
        <Button variant={filter === "mountain" ? "default" : "outline"} onClick={() => setFilter("mountain")} size="sm">
          ⛰️ Mountain
        </Button>
        <Button
          variant={filter === "archaeological" ? "default" : "outline"}
          onClick={() => setFilter("archaeological")}
          size="sm"
        >
          🏛️ Archaeological
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl">
              {getEnvironmentIcon(item.environment_type)}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <Badge className={getDifficultyColor(item.difficulty_level)}>{item.difficulty_level}</Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {item.duration_minutes} min
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  4.8
                </div>
              </div>
              <Button onClick={() => onSelectContent(item)} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start Experience
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
