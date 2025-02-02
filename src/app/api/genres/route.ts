import { NextResponse } from "next/server"
import {prisma} from "@/app/lib/prisma"

export async function GET() {
  try {
    const genres = await prisma.genre.findMany()
    return NextResponse.json(genres || [])
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const genre = await prisma.genre.create({ data: body })
    return NextResponse.json(genre)
  } catch (error) {
    console.error("Error creating genre:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}