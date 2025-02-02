"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Genre {
  id: string;
  name: string;
}

interface GenreForm {
  id: string;
  name: string;
}

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [genreForm, setGenreForm] = useState<GenreForm>({ id: "", name: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchGenres()
  }, [])

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGenreForm({ ...genreForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const url = isEditing ? `/api/genres/${genreForm.id}` : "/api/genres"
    const method = isEditing ? "PUT" : "POST"
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(genreForm),
      })
      if (response.ok) {
        await fetchGenres()
        setGenreForm({ id: "", name: "" })
        setIsEditing(false)
        setIsDialogOpen(false)
        toast({
          title: "Success",
          description: `Genre ${isEditing ? "updated" : "added"} successfully.`,
        })
      } else {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} genre`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} genre. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (genre: Genre) => {
    setGenreForm(genre)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/genres/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await fetchGenres()
        toast({
          title: "Success",
          description: "Genre deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete genre")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete genre. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openAddDialog = () => {
    setGenreForm({ id: "", name: "" })
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Genres Management</h1>
      <Button onClick={openAddDialog}>Add New Genre</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Genre" : "Add New Genre"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Genre Name</Label>
              <Input id="name" name="name" value={genreForm.name} onChange={handleInputChange} required />
            </div>
            <Button type="submit">{isEditing ? "Update Genre" : "Add Genre"}</Button>
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

