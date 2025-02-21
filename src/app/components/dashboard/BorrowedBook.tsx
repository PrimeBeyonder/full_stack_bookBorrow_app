import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string | null
  borrowings: Borrowing[]
}

interface Borrowing {
  id: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  status: BorrowStatus
  userId: string
}

enum BorrowStatus {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
}

interface BorrowedBooksProps {
  books: Book[]
  onBookReturned: () => void
  userId: string
}

export function BorrowedBooks({ books, onBookReturned, userId }: BorrowedBooksProps) {
  const [returningBooks, setReturningBooks] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const handleReturn = async (book: Book, borrowing: Borrowing) => {
    if (returningBooks.has(book.id)) return

    setReturningBooks((prev) => new Set(prev).add(book.id))

    try {
      const response = await fetch(`/api/borrowings/${borrowing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: BorrowStatus.RETURNED }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to return book")
      }

      toast({
        title: "Success",
        description: `You have successfully returned ${book.title}.`,
      })
      onBookReturned()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to return book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setReturningBooks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(book.id)
        return newSet
      })
    }
  }

  const currentlyBorrowedBooks = books.filter((book) =>
    book.borrowings.some((borrowing) => borrowing.status === BorrowStatus.BORROWED && borrowing.userId === userId),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Reading</CardTitle>
      </CardHeader>
      <CardContent>
        {currentlyBorrowedBooks.length === 0 ? (
          <p className="text-muted-foreground">You're not currently reading any books.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentlyBorrowedBooks.map((book) => {
              const activeBorrowing = book.borrowings.find(
                (b) => b.status === BorrowStatus.BORROWED && b.userId === userId,
              )
              if (!activeBorrowing) return null

              return (
                <Card key={book.id} className="overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{book.author}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="mr-1 h-3 w-3" />
                      Due {new Date(activeBorrowing.dueDate).toLocaleDateString()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleReturn(book, activeBorrowing)}
                      disabled={returningBooks.has(book.id)}
                    >
                      {returningBooks.has(book.id) ? "Returning..." : "Return"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
