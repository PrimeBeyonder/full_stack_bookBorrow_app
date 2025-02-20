import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      const token = Math.random().toString(36).substr(2, 8)
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expires: new Date(Date.now() + 3600000), // 1 hour from now
        },
      })

      await sendPasswordResetEmail(email, token)
    }

    // Always return a success message to prevent email enumeration
    return NextResponse.json({ message: "If an account exists with this email, a password reset link has been sent." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}