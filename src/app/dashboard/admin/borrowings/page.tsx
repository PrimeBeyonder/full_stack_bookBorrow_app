"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Borrowing {
  id: string
  status: "BORROWED" | "RETURNED" | "OVERDUE"
  user: {
    id: string
    name: string
  }
  book: {
    id: string
    title: string
    author: string
  }
  borrowDate: string
  dueDate: string
  returnDate?: string
}

export default function AdminBorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [filter, setFilter] = useState<"ALL" | "BORROWED" | "RETURNED" | "OVERDUE">("ALL")
  const { toast } = useToast()

  useEffect(() => {
    fetchBorrowings()
  }, [])

  const fetchBorrowings = async () => {
    try {
      const response = await fetch("/api/borrowings")
      if (!response.ok) throw new Error("Failed to fetch borrowings")
      const data = await response.json()
      setBorrowings(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch borrowings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateBorrowingStatus = async (borrowingId: string, newStatus: "BORROWED" | "RETURNED" | "OVERDUE") => {
    try {
      const response = await fetch(`/api/borrowings/${borrowingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error("Failed to update borrowing status")
      await fetchBorrowings()
      toast({
        title: "Success",
        description: "Borrowing status updated successfully.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update borrowing status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredBorrowings = borrowings.filter((borrowing) => filter === "ALL" || borrowing.status === filter)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Borrowings</h1>
      <div className="mb-4">
        <Select onValueChange={(value: "ALL" | "BORROWED" | "RETURNED" | "OVERDUE") => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="BORROWED">Borrowed</SelectItem>
            <SelectItem value="RETURNED">Returned</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Borrowings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBorrowings.map((borrowing) => (
                <TableRow key={borrowing.id}>
                  <TableCell>{borrowing.book.title}</TableCell>
                  <TableCell>{borrowing.user.name}</TableCell>
                  <TableCell>{borrowing.status}</TableCell>
                  <TableCell>{new Date(borrowing.borrowDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(borrowing.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {borrowing.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value: "BORROWED" | "RETURNED" | "OVERDUE") =>
                        updateBorrowingStatus(borrowing.id, value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BORROWED">Set as Borrowed</SelectItem>
                        <SelectItem value="RETURNED">Set as Returned</SelectItem>
                        <SelectItem value="OVERDUE">Set as Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

