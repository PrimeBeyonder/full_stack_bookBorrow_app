import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const genre = await prisma.genre.findUnique({
      where: { id: params.id },
      include: { books: true },
    })
    if (!genre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 })
    }
    return NextResponse.json(genre)
  } catch (error) {
    console.error("Error fetching genre:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const genre = await prisma.genre.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(genre)
  } catch (error) {
    console.error("Error updating genre:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.genre.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Genre deleted successfully" })
  } catch (error) {
    console.error("Error deleting genre:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
