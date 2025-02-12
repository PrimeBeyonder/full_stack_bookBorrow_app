import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "../login/action"

export async function GET(request: NextRequest) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        book: {
          include: {
            genres: true,
          },
        },
      },
    })

    const wishlist = wishlistItems.map((item) => item.book)

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { bookId } = await request.json()

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        bookId: bookId,
      },
      include: {
        book: true,
      },
    })

    return NextResponse.json(wishlistItem.book)
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

