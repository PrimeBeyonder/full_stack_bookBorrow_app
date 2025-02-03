"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publicationYear: number
  publisher: string
  description: string
  genreId: string
  language: string
  pageCount: number
  availableCopies: number
  totalCopies: number
  ebookFile?: string
}

interface Genre {
  id: string
  name: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [bookForm, setBookForm] = useState<Book>({
    id: "",
    title: "",
    author: "",
    isbn: "",
    publicationYear: 0,
    publisher: "",
    description: "",
    genreId: "",
    language: "",
    pageCount: 0,
    availableCopies: 0,
    totalCopies: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchBooks()
    fetchGenres()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        throw new Error("Failed to fetch books")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/genres")
      if (response.ok) {
        const data = await response.json()
        setGenres(data)
      } else {
        throw new Error("Failed to fetch genres")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch genres. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookForm({ ...bookForm, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(bookForm).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
    if (file) {
      formData.append("ebookFile", file)
    }

    const url = isEditing ? `/api/books/${bookForm.id}` : "/api/books"
    const method = isEditing ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      })
      if (response.ok) {
        await fetchBooks()
        setBookForm({
          id: "",
          title: "",
          author: "",
          isbn: "",
          publicationYear: 0,
          publisher: "",
          description: "",
          genreId: "",
          language: "",
          pageCount: 0,
          availableCopies: 0,
          totalCopies: 0,
        })
        setFile(null)
        setIsEditing(false)
        setIsDialogOpen(false)
        toast({
          title: "Success",
          description: `Book ${isEditing ? "updated" : "added"} successfully.`,
        })
      } else {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} book`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} book. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (book: Book) => {
    setBookForm(book)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await fetchBooks()
        toast({
          title: "Success",
          description: "Book deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete book")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openAddDialog = () => {
    setBookForm({
      id: "",
      title: "",
      author: "",
      isbn: "",
      publicationYear: 0,
      publisher: "",
      description: "",
      genreId: "",
      language: "",
      pageCount: 0,
      availableCopies: 0,
      totalCopies: 0,
    })
    setFile(null)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Books Management</h1>
      <Button onClick={openAddDialog}>Add New Book</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={bookForm.title} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={bookForm.author} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input id="isbn" name="isbn" value={bookForm.isbn} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationYear">Publication Year</Label>
                <Input
                  id="publicationYear"
                  name="publicationYear"
                  type="number"
                  value={bookForm.publicationYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  name="publisher"
                  value={bookForm.publisher}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genreId">Genre</Label>
                <Select
                  name="genreId"
                  value={bookForm.genreId}
                  onValueChange={(value) => setBookForm({ ...bookForm, genreId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" name="language" value={bookForm.language} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageCount">Page Count</Label>
                <Input
                  id="pageCount"
                  name="pageCount"
                  type="number"
                  value={bookForm.pageCount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableCopies">Available Copies</Label>
                <Input
                  id="availableCopies"
                  name="availableCopies"
                  type="number"
                  value={bookForm.availableCopies}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCopies">Total Copies</Label>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  value={bookForm.totalCopies}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={bookForm.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ebookFile">eBook File</Label>
              <Input id="ebookFile" name="ebookFile" type="file" onChange={handleFileChange} />
            </div>
            <Button type="submit">{isEditing ? "Update Book" : "Add Book"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong>Available Copies:</strong> {book.availableCopies}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleEdit(book)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(book.id)}>
                Delete
              </Button>
              <Link href={`/dashboard/books/${book.id}`} passHref>
                <Button variant="link">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

