import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "../../login/action"

export async function GET() {
  const user = await getUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        book: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching all reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
