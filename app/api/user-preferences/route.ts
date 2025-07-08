import { type NextRequest, NextResponse } from "next/server"

const mockUserPreferences = {
  1: {
    preferred_environments: ["underwater", "forest"],
    comfort_settings: {
      motion_sickness_reduction: true,
      teleport_movement: true,
      comfort_vignetting: true,
    },
    audio_preferences: {
      master_volume: 0.8,
      spatial_audio: true,
      ambient_sounds: true,
    },
    visual_preferences: {
      brightness: 0.7,
      contrast: 0.6,
      field_of_view: 90,
    },
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const preferences = mockUserPreferences[Number.parseInt(userId)] || {
      preferred_environments: [],
      comfort_settings: {
        motion_sickness_reduction: true,
        teleport_movement: true,
        comfort_vignetting: true,
      },
      audio_preferences: {
        master_volume: 0.8,
        spatial_audio: true,
        ambient_sounds: true,
      },
      visual_preferences: {
        brightness: 0.7,
        contrast: 0.6,
        field_of_view: 90,
      },
    }

    return NextResponse.json({
      success: true,
      preferences,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user_id, preferences } = await request.json()

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // update the database
    mockUserPreferences[user_id] = preferences

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      preferences,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
