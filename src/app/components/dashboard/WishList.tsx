import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  availability: number
}

export function Wishlist({ books = [] }: { books: Book[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <p className="text-muted-foreground">Your wishlist is empty.</p>
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
                  <p className="text-sm text-muted-foreground mb-4">{book.availability} copies available</p>
                  <Button variant="outline" size="sm" className="w-full" disabled={book.availability === 0}>
                    {book.availability > 0 ? "Borrow" : "Unavailable"}
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

