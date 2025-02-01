import Link from "next/link"
import { Book, BookOpen, Star } from "lucide-react"

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-md">
      <div className="flex h-20 items-center justify-center border-b">
        <h1 className="text-2xl font-bold">BookBorrow Admin</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <Link href="/dashboard/books" className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100">
          <Book className="h-5 w-5" />
          <span>Books</span>
        </Link>
        <Link href="/dashboard/borrowings" className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100">
          <BookOpen className="h-5 w-5" />
          <span>Borrowings</span>
        </Link>
        <Link href="/dashboard/reviews" className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100">
          <Star className="h-5 w-5" />
          <span>Reviews</span>
        </Link>
      </nav>
    </div>
  )
}