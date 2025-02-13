import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")
  const author = searchParams.get("author")
  const genre = searchParams.get("genre")

  const where = {
    ...(title && { title: { contains: title, mode: "insensitive" } }),
    ...(author && { author: { contains: author, mode: "insensitive" } }),
    ...(genre && { genres: { some: { name: genre } } }),
  }

  try {
    const books = await prisma.book.findMany({
      where,
      include: { genres: true, borrowings: true },
    })
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const bookData = Object.fromEntries(formData)

    let ebookFilePath = null
    const ebookFile = formData.get("ebookFile") as File | null
    if (ebookFile) {
      const bytes = await ebookFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${ebookFile.name}`
      const filePath = path.join(process.cwd(), "public", "ebooks", fileName)
      await writeFile(filePath, buffer)
      ebookFilePath = `/ebooks/${fileName}`
    }

    let coverImagePath = null
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

    const book = await prisma.book.create({
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
          connect: genreIds.map((id) => ({ id })),
        },
      },
      include: { genres: true },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}

