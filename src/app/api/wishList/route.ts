import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "../login/action"

// Get user's wishlist
export async function GET() {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const wishlist = await prisma.book.findMany({
      where: {
        wishlistItems: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        genres: true,
        _count: {
          select: {
            wishlistItems: true,
          },
        },
      },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

// Add book to wishlist
