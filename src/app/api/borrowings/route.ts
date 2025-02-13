import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUser } from "../login/action";

export async function POST(request: NextRequest) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { bookId, dueDate } = await request.json()

    const book = await prisma.book.findUnique({ where: { id: bookId } })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    if (book.availableCopies < 1) {
      return NextResponse.json({ error: "No copies available" }, { status: 400 })
    }

    // Check if the user has already borrowed this book and not returned it
    const existingBorrowing = await prisma.borrowing.findFirst({
      where: {
        userId: user.id,
        bookId: bookId,
        status: "BORROWED",
      },
    })

    if (existingBorrowing) {
      return NextResponse.json({ error: "You have already borrowed this book" }, { status: 400 })
    }

    const borrowing = await prisma.borrowing.create({
      data: {
        userId: user.id,
        bookId,
        dueDate: new Date(dueDate),
        status: "BORROWED",
      },
      include: { book: true, user: true },
    })

    await prisma.book.update({
      where: { id: bookId },
      data: { availableCopies: { decrement: 1 } },
    })

    return NextResponse.json(borrowing, { status: 201 })
  } catch (error) {
    console.error("Error creating borrowing:", error)
    return NextResponse.json({ error: "Failed to create borrowing" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const borrowings = await prisma.borrowing.findMany({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
      include: { book: true, user: true },
    })

    return NextResponse.json(borrowings)
  } catch (error) {
    console.error("Error fetching borrowings:", error)
    return NextResponse.json({ error: "Failed to fetch borrowings" }, { status: 500 })
  }
}

