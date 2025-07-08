import { type NextRequest, NextResponse } from "next/server"

const mockInteractions: any[] = []

export async function POST(request: NextRequest) {
  try {
    const interactionData = await request.json()

    const newInteraction = {
      id: mockInteractions.length + 1,
      ...interactionData,
      timestamp: new Date().toISOString(),
    }

    mockInteractions.push(newInteraction)

    return NextResponse.json({
      success: true,
      interaction: newInteraction,
      message: "Interaction recorded successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to record interaction" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")
    const sessionId = searchParams.get("session_id")

    let filteredInteractions = mockInteractions

    if (userId) {
      filteredInteractions = filteredInteractions.filter(
        (interaction) => interaction.user_id === Number.parseInt(userId),
      )
    }

    if (sessionId) {
      filteredInteractions = filteredInteractions.filter((interaction) => interaction.session_id === sessionId)
    }

    return NextResponse.json({
      success: true,
      interactions: filteredInteractions,
      total: filteredInteractions.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interactions" }, { status: 500 })
  }
}
