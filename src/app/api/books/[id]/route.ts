import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { writeFile, unlink } from "fs/promises"
import path from "path"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: { genres: true },
    })
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const bookData = Object.fromEntries(formData)

    let ebookFilePath = bookData.ebookFile as string
    const ebookFile = formData.get("ebookFile") as File | null
    if (ebookFile) {
      const bytes = await ebookFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${ebookFile.name}`
      const filePath = path.join(process.cwd(), "public", "ebooks", fileName)
      await writeFile(filePath, buffer)
      ebookFilePath = `/ebooks/${fileName}`
    }

    let coverImagePath = bookData.coverImage as string
    const coverImage = formData.get("coverImage") as File | null
    if (coverImage) {
      const bytes = await coverImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${coverImage.name}`
      const filePath = path.join(process.cwd(), "public", "covers", fileName)
      await writeFile(filePath, buffer)
      coverImagePath = `/covers/${fileName}`
    }
    const genreIds = formData.getAll("genreIds") as string[]

    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: bookData.title as string,
        author: bookData.author as string,
        isbn: bookData.isbn as string,
        publicationYear: Number(bookData.publicationYear),
        publisher: bookData.publisher as string,
        description: bookData.description as string,
        language: bookData.language as string,
        pageCount: Number(bookData.pageCount),
        availableCopies: Number(bookData.availableCopies),
        totalCopies: Number(bookData.totalCopies),
        ebookFile: ebookFilePath,
        coverImage: coverImagePath,
        genres: {
          set: genreIds.map((id) => ({ id })),
        },
      },
      include: { genres: true },
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const book = await prisma.book.delete({ where: { id: params.id } })
    if (book.ebookFile) {
      const filePath = path.join(process.cwd(), "public", book.ebookFile)
      await unlink(filePath)
    }
    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}

