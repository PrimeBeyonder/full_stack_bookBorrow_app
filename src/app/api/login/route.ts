import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
        where: {email}
    })

    if(!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    const isPasswordValid = await compare(password, user.password)

    if(!isPasswordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    const token = sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "1h" },
    )

    const response = NextResponse.json({
        user: {id: user.id, email: user.email, role: user.role}, token
    })
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
    })
    return response
}