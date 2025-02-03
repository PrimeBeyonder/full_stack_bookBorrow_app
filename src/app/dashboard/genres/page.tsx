"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Genre {
  id: string
  name: string
}

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [newGenre, setNewGenre] = useState("")
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/genres")
      if (!response.ok) throw new Error("Failed to fetch genres")
      const data = await response.json()
      setGenres(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch genres. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingGenre ? `/api/genres/${editingGenre.id}` : "/api/genres"
      const method = editingGenre ? "PUT" : "POST"
      const body = JSON.stringify({ name: newGenre })

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      })

      if (!response.ok) throw new Error("Failed to save genre")

      await fetchGenres()
      setNewGenre("")
      setEditingGenre(null)
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: `Genre ${editingGenre ? "updated" : "added"} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingGenre ? "update" : "add"} genre. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre)
    setNewGenre(genre.name)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/genres/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete genre")
      await fetchGenres()
      toast({
        title: "Success",
        description: "Genre deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete genre. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Genres Management</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setEditingGenre(null)
              setNewGenre("")
            }}
          >
            Add New Genre
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGenre ? "Edit Genre" : "Add New Genre"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Genre Name</Label>
              <Input id="name" value={newGenre} onChange={(e) => setNewGenre(e.target.value)} required />
            </div>
            <Button type="submit">{editingGenre ? "Update Genre" : "Add Genre"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {genres.map((genre) => (
            <TableRow key={genre.id}>
              <TableCell>{genre.name}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(genre)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(genre.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

