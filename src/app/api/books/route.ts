import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import formidable from "formidable"
import { mkdir } from "fs/promises"
import path from "path"


export const config = {
  api: {
    bodyParser: false,
  },
}

interface FormFields {
  title: string;
  author: string;
  isbn: string;
  publicationYear: string;
  publisher: string;
  description: string;
  genreId: string;
  language: string;
  pageCount: string;
  availableCopies: string;
  totalCopies: string;
}

interface FormFiles {
  ebookFile?: formidable.File[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")
  const author = searchParams.get("author")
  const genre = searchParams.get("genre")

  const where = {
    ...(title && { title: { contains: title, mode: "insensitive" } }),
    ...(author && { author: { contains: author, mode: "insensitive" } }),
    ...(genre && { genre: { name: genre } }),
  }

  try {
    const books = await prisma.book.findMany({
      where,
      include: { genre: true },
    })
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), "public", "ebooks")
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    console.error("Error creating upload directory:", error)
  }

  const form = formidable({
    uploadDir,
    filename: (name, ext, part) => {
      return `${Date.now()}-${part.originalFilename}`
    },
  })

  return new Promise((resolve, reject) => {
    form.parse(request, async (err, fields: FormFields, files: FormFiles) => {
      if (err) {
        console.error("Error parsing form:", err)
        reject(NextResponse.json({ error: "Error parsing form data" }, { status: 500 }))
        return
      }

      try {
        let ebookFilePath = null
        if (files.ebookFile && files.ebookFile[0]) {
          const file = files.ebookFile[0]
          ebookFilePath = `/ebooks/${file.newFilename}`
        }

        const bookData = {
          title: fields.title,
          author: fields.author,
          isbn: fields.isbn,
          publicationYear: parseInt(fields.publicationYear),
          publisher: fields.publisher,
          description: fields.description,
          genreId: fields.genreId,
          language: fields.language,
          pageCount: parseInt(fields.pageCount),
          availableCopies: parseInt(fields.availableCopies),
          totalCopies: parseInt(fields.totalCopies),
          ebookFile: ebookFilePath,
        }

        const book = await prisma.book.create({ data: bookData })
        resolve(NextResponse.json(book))
      } catch (error) {
        console.error("Error creating book:", error)
        reject(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }))
      }
    })
  })
}
