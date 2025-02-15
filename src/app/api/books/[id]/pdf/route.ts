import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "@/app/api/login/action"
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        borrowings: {
          where: {
            userId: user.id,
            status: "BORROWED",
          },
        },
      },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    if (book.borrowings.length === 0) {
      return NextResponse.json({ error: "You haven't borrowed this book" }, { status: 403 })
    }

    if (!book.ebookFile) {
      return NextResponse.json({ error: "eBook file not available" }, { status: 404 })
    }

    return NextResponse.json({ pdfUrl: book.ebookFile })
  } catch (error) {
    console.error("Error fetching PDF URL:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

