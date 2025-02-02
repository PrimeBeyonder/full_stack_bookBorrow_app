import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import formidable from "formidable"
import { type Fields, type Files } from "formidable"

import path from "path"
import fs from "fs"

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

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
      const book = await prisma.book.findUnique({
        where: { id: params.id },
        include: { genre: true, reviews: true },
      })
      if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 })
      }
      return NextResponse.json(book)
    } catch (error) {
      console.error("Error fetching book:", error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
  }

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const form = new formidable.IncomingForm()
  try {
    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
        form.parse(request, (err, fields, files) => {
          if (err) reject(err)
          else resolve([fields, files])
        })
      })
  

    let ebookFilePath: string | undefined = Array.isArray(fields.ebookFile) ? fields.ebookFile[0] : fields.ebookFile;
    if (files.ebookFile) {
        const file = Array.isArray(files.ebookFile) ? files.ebookFile[0] : files.ebookFile
        const fileName = `${Date.now()}-${file.originalFilename}`
        const newPath = path.join(process.cwd(), "public", "ebooks", fileName)
        await fs.promises.copyFile(file.filepath, newPath)
        ebookFilePath = `/ebooks/${fileName}`
    }

    const bookData = {
        title: fields.title ,
        author: fields.author ,
        isbn: fields.isbn ,
        publicationYear: fields.publicationYear ,
        publisher: fields.publisher ,
        description: fields.description ,
        genreId: fields.genreId ,
        language: fields.language ,
        pageCount: fields.pageCount ,
        availableCopies: fields.availableCopies ,
        totalCopies: fields.totalCopies ,
        ebookFile: ebookFilePath,
      }

    const book = await prisma.book.update({
      where: { id: params.id },
      data: bookData,
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const book = await prisma.book.delete({ where: { id: params.id } })
      if (book.ebookFile) {
        const filePath = path.join(process.cwd(), "public", book.ebookFile)
        await fs.promises.unlink(filePath)
      }
      return NextResponse.json({ message: "Book deleted successfully" })
    } catch (error) {
      console.error("Error deleting book:", error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
  }