"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publicationYear: number
  publisher: string
  description: string
  language: string
  pageCount: number
  availableCopies: number
  totalCopies: number
  coverImage?: string
}

export default function BookDetailsPage() {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch book")
        const data = await response.json()
        setBook(data)
      } catch (error) {
        console.error("Error fetching book:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchBook()
    }
  }, [params.id])

  if (isLoading) {
    return <div>Loading book details...</div>
  }

  if (!book) {
    return <div>Book not found</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="aspect-[3/4] relative">
          <Image
            src={book.coverImage || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Author</h3>
            <p>{book.author}</p>
          </div>
          <div>
            <h3 className="font-semibold">ISBN</h3>
            <p>{book.isbn}</p>
          </div>
          <div>
            <h3 className="font-semibold">Publication Year</h3>
            <p>{book.publicationYear}</p>
          </div>
          <div>
            <h3 className="font-semibold">Publisher</h3>
            <p>{book.publisher}</p>
          </div>
          <div>
            <h3 className="font-semibold">Language</h3>
            <p>{book.language}</p>
          </div>
          <div>
            <h3 className="font-semibold">Page Count</h3>
            <p>{book.pageCount}</p>
          </div>
          <div>
            <h3 className="font-semibold">Availability</h3>
            <p>
              {book.availableCopies} / {book.totalCopies} copies available
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p>{book.description}</p>
          </div>
          <Button className="w-full">Borrow Book</Button>
        </div>
      </CardContent>
    </Card>
  )
}

