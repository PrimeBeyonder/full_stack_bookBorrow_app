import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Bookmark, X } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  availableCopies: number
}

interface WishlistProps {
  books: Book[]
}

export function Wishlist({ books }: WishlistProps) {
  const { toast } = useToast()

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${bookId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove book")

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
      <Card>
      <CardHeader>
        <CardTitle>Your WishList</CardTitle>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <p className="text-muted-foreground">No Books are added in a wishlist</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-4">
                  <div className="aspect-[3/4] relative mb-4">
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Bookmark className="mr-1 h-3 w-3" />
                    {book.availableCopies} available
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRemoveFromWishlist(book.id)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

