"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publicationYear: number
  publisher: string
  description: string
  genres: { id: string; name: string }[]
  language: string
  pageCount: number
  availableCopies: number
  totalCopies: number
  ebookFile?: string
  coverImage?: string
  borrowings: {
    id: string
    status: "BORROWED" | "RETURNED" | "OVERDUE"
    user: {
      name: string
    }
    borrowDate: string
    dueDate: string
    returnDate?: string
  }[]
}

export default function BookDetailPage() {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch book")
        const data = await response.json()
        setBook(data)
        setIsLoading(false)
      } catch {
        setError("Failed to fetch book. Please try again.")
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchBook()
    }
  }, [params.id])


  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!book) return <div>Book not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        Back to Books
      </Button>
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="relative h-96 w-full">
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
            </div>
          </div>
          <div className="md:w-2/3 p-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{book.title}</CardTitle>
              <p className="text-xl text-muted-foreground">{book.author}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">ISBN:</p>
                  <p className="text-muted-foreground">{book.isbn}</p>
                </div>
                <div>
                  <p className="font-semibold">Publication Year:</p>
                  <p className="text-muted-foreground">{book.publicationYear}</p>
                </div>
                <div>
                  <p className="font-semibold">Publisher:</p>
                  <p className="text-muted-foreground">{book.publisher}</p>
                </div>
                <div>
                  <p className="font-semibold">Language:</p>
                  <p className="text-muted-foreground">{book.language}</p>
                </div>
                <div>
                  <p className="font-semibold">Page Count:</p>
                  <p className="text-muted-foreground">{book.pageCount}</p>
                </div>
                <div>
                  <p className="font-semibold">Available Copies:</p>
                  <p className="text-muted-foreground">
                    {book.availableCopies} / {book.totalCopies}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Genres:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {book.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Description:</p>
                <p className="text-muted-foreground">{book.description}</p>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}

