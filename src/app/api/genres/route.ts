import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const genres = await prisma.genre.findMany()
  return NextResponse.json(genres)
}

export async function POST(request: Request) {
  const body = await request.json()
  const genre = await prisma.genre.create({ data: body })
  return NextResponse.json(genre)
}
