"use client"


import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book, Calendar, Clock, Globe, Hash, Heart, Layers } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { ReviewForm } from "@/app/components/reviews/ReviewForm"
import { ReviewList } from "@/app/components/reviews/ReviewList"

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
  dueDate: string
  availableCopies: number
  totalCopies: number
  coverImage?: string
  wishlistItems: { userId: string }[]
}


interface Borrowing {
  id: string
  userId: string
  bookId: string
  status: "BORROWED" | "RETURNED"
  borrowDate: string
  dueDate: string
  returnDate?: string
}
interface BorrowingHistory {
  id: string
  bookId: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
}

export default function BookDetailPage() {
  const [book, setBook] = useState<Book | null>(null)
  const [borrowing, setBorrowing] = useState<Borrowing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingHistory[]>([])
  const currentBorrowing = borrowingHistory.find((borrow) => borrow.bookId === book.id && !borrow.returnDate)
  const isOverdue = currentBorrowing && new Date(currentBorrowing.dueDate) < new Date()
  const params = useParams()
  const { toast } = useToast()
    const { data: session, status } = useSession()
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    fetchBook()
    fetchBorrowing()
    fetchBorrowingHistory()
     console.log("Session status:", status)
    console.log("Session data:", session)
  },  [session, status])

const fetchBorrowingHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/borrowings/history")
      if (!response.ok) throw new Error("Failed to fetch borrowing history")
      const data = await response.json()
      setBorrowingHistory(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch borrowing history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch book")
      const data = await response.json()
      setBook(data)
      setIsLoading(false)
    } catch  {
      toast({
        title: "Error",
        description: "Failed to fetch book details. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const fetchBorrowing = async () => {
    try {
      const response = await fetch(`/api/borrowings?bookId=${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch borrowing")
      const data = await response.json()
      if (data.length > 0) {
        setBorrowing(data[0])
      }
    } catch (error) {
      console.error("Error fetching borrowing:", error)
    }
  }

  const handleBorrow = async () => {
    try {
      const response = await fetch("/api/borrowings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book?.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to borrow book")
      }

      const newBorrowing = await response.json()
      setBorrowing(newBorrowing)
      toast({
        title: "Success",
        description: `You have successfully borrowed ${book?.title}.`,
      })
      fetchBook() // Refresh book data to update available copies
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReturn = async () => {
    if (!borrowing) return

    try {
      const response = await fetch(`/api/borrowings/${borrowing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RETURNED" }),
      })

      if (!response.ok) {
        throw new Error("Failed to return book")
      }

      toast({
        title: "Success",
        description: `You have successfully returned ${book?.title}.`,
      })
      setBorrowing(null)
      fetchBook() // Refresh book data to update available copies
    } catch {
      toast({
        title: "Error",
        description: "Failed to return book. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleWishlist = async () => {
    try {
      const method = isWishlisted ? "DELETE" : "POST"
      const response = await fetch(`/api/wishlist/${book?.id}`, { method })

      if (!response.ok) throw new Error()

      setIsWishlisted(!isWishlisted)
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: `${book?.title} has been ${isWishlisted ? "removed from" : "added to"} your wishlist`,
      })
    } catch  {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!book) return <div>Book not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
 <Card className="w-full max-w-6xl mx-auto bg-gray-50">
      <CardContent className="p-6">
        <div className="md:flex gap-6">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <Image
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              width={300}
              height={450}
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>
            <p className="mb-6 text-gray-700 leading-relaxed">{book.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-gray-500" />
                <span className="text-sm">ISBN: {book.isbn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Published: {book.publicationYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Publisher: {book.publisher}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Language: {book.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Pages: {book.pageCount}</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Badge variant="secondary">Available: {book.availableCopies}</Badge>
              <Badge variant="secondary">Total: {book.totalCopies}</Badge>
            </div>

            {currentBorrowing && (
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-100 text-blue-800">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Borrowed on:</span>
                  <span>{new Date(currentBorrowing.borrowDate).toLocaleDateString()}</span>
                </div>
                <div
                  className={`flex items-center gap-2 p-3 rounded-md ${
                    isOverdue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  <Clock className={`w-5 h-5 ${isOverdue ? "text-red-500" : "text-green-500"}`} />
                  <span className="font-semibold">{isOverdue ? "Overdue" : "Due date"}:</span>
                  <span>{new Date(currentBorrowing.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              {currentBorrowing ? (
                <Button onClick={handleReturn}>Return Book</Button>
              ) : (
                <Button onClick={handleBorrow} disabled={book.availableCopies === 0}>
                  {book.availableCopies > 0 ? "Borrow" : "Unavailable"}
                </Button>
              )}
              <Button variant="outline" onClick={handleWishlist}>
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
     <Card className="mt-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {status === "loading" ? (
            <div>Loading...</div>
          ) : status === "authenticated" ? (
            showReviewForm ? (
              <ReviewForm bookId={book?.id as string} onSuccess={() => setShowReviewForm(false)} />
            ) : (
              <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
            )
          ) : (
            <p>Please log in to write a review.</p>
          )}
          <ReviewList bookId={book?.id as string} />
        </CardContent>
      </Card>
    </div>
  )
}

