import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  dueDate: string
}

export function BorrowedBooks({ books = [] }: { books: Book[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Reading</CardTitle>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <p className="text-muted-foreground">You're not currently reading any books.</p>
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
                    <Calendar className="mr-1 h-3 w-3" />
                    Due {new Date(book.dueDate).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Return
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

