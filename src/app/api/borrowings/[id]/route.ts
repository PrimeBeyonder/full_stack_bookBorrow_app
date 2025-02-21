import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUser } from "../../login/action";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: params.id },
      include: { book: true, user: true },
    })

    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing not found" }, { status: 404 })
    }

    if (user.role !== "ADMIN" && borrowing.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(borrowing)
  } catch (error) {
    console.error("Error fetching borrowing:", error)
    return NextResponse.json({ error: "Failed to fetch borrowing" }, { status: 500 })
  }
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { status } = await request.json()

    const borrowing = await prisma.borrowing.findUnique({
      where: { id: params.id },
      include: { book: true },
    })

    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing not found" }, { status: 404 })
    }

    if (borrowing.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedBorrowing = await prisma.borrowing.update({
      where: { id: params.id },
      data: {
        status,
        returnDate: status === "RETURNED" ? new Date() : null,
      },
      include: { book: true, user: true },
    })

    if (status === "RETURNED") {
      await prisma.book.update({
        where: { id: borrowing.bookId },
        data: { availableCopies: { increment: 1 } },
      })
    }

    return NextResponse.json(updatedBorrowing)
  } catch (error) {
    console.error("Error updating borrowing:", error)
    return NextResponse.json({ error: "Failed to update borrowing" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser()

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: params.id },
      include: { book: true },
    })

    if (!borrowing) {
      return NextResponse.json({ error: "Borrowing not found" }, { status: 404 })
    }

    await prisma.borrowing.delete({ where: { id: params.id } })

    if (borrowing.status === "BORROWED") {
      await prisma.book.update({
        where: { id: borrowing.bookId },
        data: { availableCopies: { increment: 1 } },
      })
    }

    return NextResponse.json({ message: "Borrowing deleted successfully" })
  } catch (error) {
    console.error("Error deleting borrowing:", error)
    return NextResponse.json({ error: "Failed to delete borrowing" }, { status: 500 })
  }
}