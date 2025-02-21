import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getUser } from "../../login/action"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const borrowingHistory = await prisma.borrowing.findMany({
      where: {
        userId: user.id,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        borrowDate: "desc",
      },
    })

    return NextResponse.json(borrowingHistory)
  } catch (error) {
    console.error("Error fetching borrowing history:", error)
    return NextResponse.json({ error: "Failed to fetch borrowing history" }, { status: 500 })
  }
}

