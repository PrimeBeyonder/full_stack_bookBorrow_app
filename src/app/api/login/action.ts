"use server"

import { cookies } from "next/headers"
import { prisma } from "@/app/lib/prisma"
import { compare } from "bcryptjs"

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { error: "Invalid email or password" }
  }

  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    return { error: "Invalid email or password" }
  }

  // Set the session cookie
  const cookieStore = await cookies()
   cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
    path: "/",
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  }
}
  export const LogOut = async () => {
    const cookieStore = await cookies()
     cookieStore.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: -1,
     })
}
  
export async function getUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      avatar: true,
      bio: true,
    },
  })

  return user
}