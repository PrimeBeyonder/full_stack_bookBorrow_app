import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "../../login/action"

// Remove book from wishlist
export async function DELETE(request: NextRequest, { params }: { params: { bookId: string } }) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const bookId = params.bookId

    // Check if book exists in wishlist
    const existingWishlist = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        bookId: bookId,
      },
    })

    if (!existingWishlist) {
      return NextResponse.json({ error: "Book not found in wishlist" }, { status: 404 })
    }

    // Remove book from wishlist
    await prisma.wishlistItem.delete({
      where: {
        id: existingWishlist.id,
      },
    })

    return NextResponse.json({ message: "Book removed from wishlist" })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

// Check if book is in user's wishlist
export async function GET(request: NextRequest, { params }: { params: { bookId: string } }) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const bookId = params.bookId

    const isWishlisted = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        bookId: bookId,
      },
    })

    return NextResponse.json({ isWishlisted: !!isWishlisted })
  } catch (error) {
    console.error("Error checking wishlist status:", error)
    return NextResponse.json({ error: "Failed to check wishlist status" }, { status: 500 })
  }
}

// Add book to wishlist
export async function POST(request: NextRequest) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { bookId } = await request.json()

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if book is already in wishlist
    const existingWishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        bookId: bookId,
      },
    })

    if (existingWishlistItem) {
      return NextResponse.json({ error: "Book already in wishlist" }, { status: 400 })
    }

    // Add book to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        bookId: bookId,
      },
    })

    return NextResponse.json(wishlistItem)
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}