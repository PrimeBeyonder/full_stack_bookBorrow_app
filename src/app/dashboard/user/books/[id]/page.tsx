"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Book, Globe, Hash, Heart } from "lucide-react"
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
  const params = useParams()
  const { toast } = useToast()

useEffect(() => {
  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch book")
      const data = await response.json()
      setBook(data)
      
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      // Check if book is in user's wishlist
      setIsWishlisted(data.wishlistItems?.some((w: any) => w.userId === user.id) || false)
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

const handleWishlist = async () => {
  try {
    const response = await fetch(`/api/wishlist/${book?.id}`, {
      method: isWishlisted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      ...((!isWishlisted && {
        body: JSON.stringify({ bookId: book?.id })
      }))
    })
    console.log(response);

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
              <Button className="flex-1">Borrow Book</Button>
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

