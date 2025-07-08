import { type NextRequest, NextResponse } from "next/server"

const mockVRContent = [
  {
    id: 1,
    title: "Ocean Depths Explorer",
    description: "Dive into the mysterious depths of the ocean and discover marine life",
    environment_type: "underwater",
    content_url: "/vr/ocean-depths",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    difficulty_level: "beginner",
    duration_minutes: 15,
  },
  {
    id: 2,
    title: "Space Station Adventure",
    description: "Experience life aboard a space station in zero gravity",
    environment_type: "space",
    content_url: "/vr/space-station",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    difficulty_level: "intermediate",
    duration_minutes: 25,
  },
  {
    id: 3,
    title: "Ancient Forest Journey",
    description: "Walk through an enchanted ancient forest with magical creatures",
    environment_type: "forest",
    content_url: "/vr/ancient-forest",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    difficulty_level: "beginner",
    duration_minutes: 20,
  },
  {
    id: 4,
    title: "Cyberpunk City Tour",
    description: "Navigate through a futuristic cyberpunk metropolis",
    environment_type: "urban",
    content_url: "/vr/cyberpunk-city",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    difficulty_level: "advanced",
    duration_minutes: 30,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const environment_type = searchParams.get("environment_type")
    const difficulty = searchParams.get("difficulty")

    let filteredContent = mockVRContent

    if (environment_type) {
      filteredContent = filteredContent.filter((content) => content.environment_type === environment_type)
    }

    if (difficulty) {
      filteredContent = filteredContent.filter((content) => content.difficulty_level === difficulty)
    }

    return NextResponse.json({
      success: true,
      content: filteredContent,
      total: filteredContent.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch VR content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentData = await request.json()

    // save to database
    const newContent = {
      id: mockVRContent.length + 1,
      ...contentData,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      content: newContent,
      message: "VR content created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create VR content" }, { status: 500 })
  }
}
