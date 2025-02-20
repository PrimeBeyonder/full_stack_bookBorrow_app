import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/app/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    
    const body = await req.json()

    
    console.log("Request Body:", body)

  
    const { email, name, password } = body


    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }


    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: false,
      },
    })

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit code
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })

    await sendVerificationEmail(user.email, verificationToken.token)

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    // Log the error more comprehensively
    if (error instanceof Error) {
      console.error("Signup error:", error.message)
      console.error("Error stack:", error.stack)
    } else {
      console.error("Signup error:", error)
    }

    return NextResponse.json({ error: "Failed to create user, please try again later" }, { status: 500 })
  }
}

