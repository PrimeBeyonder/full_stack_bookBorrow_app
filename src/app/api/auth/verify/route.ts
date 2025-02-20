import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json()

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    })

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    })

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}
