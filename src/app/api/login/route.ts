import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { compare } from "bcryptjs"

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
  }

  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
  }

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
  })

  // Set the session cookie with the user's ID
  response.cookies.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
    path: "/",
  })

  console.log("Session cookie set:", user.id) // Add this log

  return response
}

