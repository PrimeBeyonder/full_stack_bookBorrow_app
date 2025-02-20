import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!passwordResetToken || passwordResetToken.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.update({
      where: { id: passwordResetToken.userId },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken.id },
    })

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "An error occurred while resetting the password" }, { status: 500 })
  }
}

