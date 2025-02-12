"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bookmark, X } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  availableCopies: number
}

export function Wishlist({ books }: { books: Book[] }) {
  const [wishlist, setWishlist] = useState<Book[]>(books)
  const { toast } = useToast()

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${bookId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove book")

      setWishlist((prev) => prev.filter((book) => book.id !== bookId))

      toast({
        title: "Removed from Wishlist",
        description: "Book has been removed successfully.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Could not remove book from wishlist.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          My Wishlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {wishlist.length === 0 ? (
          <div className="text-center py-10">
            <Bookmark className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">Your wishlist is empty.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Start adding books you love!</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {wishlist.map((book) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="w-full h-full overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] relative w-full">
                        <Image
                          src={book.coverImage.startsWith("/") ? book.coverImage : `/covers/${book.coverImage}`}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button variant="secondary" size="sm" className="mr-2" disabled={book.availableCopies === 0}>
                            {book.availableCopies > 0 ? "Borrow" : "Unavailable"}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveFromWishlist(book.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">{book.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {book.availableCopies} {book.availableCopies === 1 ? "copy" : "copies"} available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}

