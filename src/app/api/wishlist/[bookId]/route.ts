import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "../../login/action"

export async function POST(request: NextRequest, { params }: { params: { bookId: string } }) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bookId = params.bookId

  try {
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

export async function DELETE(request: NextRequest, { params }: { params: { bookId: string } }) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bookId = await params.bookId

  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: bookId,
        },
      },
    })

    return NextResponse.json({ message: "Book removed from wishlist" })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}