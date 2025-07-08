import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

 
    // Mock authentication logic
    const mockUsers = [
      { id: 1, email: "name@gmail.com", username: "user" },
      { id: 2, email: "name1@gmail.com", username: "user1" },
      { id: 3, email: "name2@gmail.com", username: "vr_exp" },
    ]

    const user = mockUsers.find((u) => u.email === email)

    if (!user || password !== "demo123") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In production, use proper JWT tokens
    const token = `mock_token_${user.id}_${Date.now()}`

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, username: user.username },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
