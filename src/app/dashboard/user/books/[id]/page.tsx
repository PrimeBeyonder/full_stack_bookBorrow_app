"use client"

import { useState, useEffect } from "react"
import { useParams,useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Book, Globe, Hash, Heart,BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  wishlistItems: { userId: string }[]
}

export default function BookDetailsPage() {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
   const [isBorrowed, setIsBorrowed] = useState(false)
  const [isBorrowing, setIsBorrowing] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchBook()
  }, []) // Removed params.id from dependencies

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch book")
      const data = await response.json()
      setBook(data)
      // Check if current user has wishlisted this book
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      setIsWishlisted(data.wishlistItems.some((w: any) => w.userId === user.id))
      setIsBorrowed(data.borrowings.some((b: any) => b.userId === user.id && b.status === "BORROWED"))
    } catch (error) {
      console.error("Error fetching book:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist/${book?.id}`, {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book?.id }),
      })

      if (!response.ok) throw new Error()

      setIsWishlisted(!isWishlisted)
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: `${book?.title} has been ${isWishlisted ? "removed from" : "added to"} your wishlist`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }

  const handleBorrow = async () => {
    if (!book) return

    setIsBorrowing(true)
    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 4) // Set due date to 4 days from now

      const response = await fetch("/api/borrowings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          dueDate: dueDate.toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to borrow book")
      }

      toast({
        title: "Book Borrowed",
        description: `You have successfully borrowed ${book.title}. It is due on ${dueDate.toLocaleDateString()}.`,
      })

      // Refresh book data to update available copies
      await fetchBook()
    } catch (error) {
      console.error("Error borrowing book:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBorrowing(false)
    }
  }
 const handleRead = () => {
    router.push(`/dashboard/user/books/${book?.id}/read`)
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading book details...</div>
  }

  if (!book) {
    return <div className="text-center py-10">Book not found</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative aspect-[2/3]">
            <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
          </div>
          <div className="md:w-2/3 p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600">{book.author}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar size={14} />
                {book.publicationYear}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Book size={14} />
                {book.pageCount} pages
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe size={14} />
                {book.language}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Hash size={14} />
                {book.isbn}
              </Badge>
            </div>
            <p className="text-gray-700">{book.description}</p>
            <div className="space-y-2">
              <p className="font-semibold">
                Publisher: <span className="font-normal">{book.publisher}</span>
              </p>
              <p className="font-semibold">
                Availability:{" "}
                <span className="font-normal">
                  {book.availableCopies} of {book.totalCopies}
                </span>
              </p>
            </div>
            <div className="flex gap-4">
             {isBorrowed ? (
                <Button className="flex-1" onClick={handleRead}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Book
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleBorrow} disabled={book.availableCopies === 0 || isBorrowing}>
                  {isBorrowing ? "Borrowing..." : "Borrow Book"}
                </Button>
              )}
              <Button variant={isWishlisted ? "default" : "outline"} className="flex-1" onClick={handleWishlist}>
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

