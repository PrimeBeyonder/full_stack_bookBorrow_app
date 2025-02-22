import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "../login/action"

export async function POST(request: Request) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { bookId, rating, comment } = await request.json()
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        bookId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get("bookId")

  if (!bookId) {
    return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

