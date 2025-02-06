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
  await cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
    path: "/",
  })

  console.log("Session cookie set:", user.id)

  return { user: { id: user.id, email: user.email, role: user.role } }
}

