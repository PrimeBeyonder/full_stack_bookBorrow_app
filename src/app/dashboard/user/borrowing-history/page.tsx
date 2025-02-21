"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { RefreshCw, Book, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface BorrowingHistory {
  id: string
  book: {
    title: string
  }
  borrowDate: string
  returnDate: string | null
}

export default function BorrowingHistoryPage() {
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBorrowingHistory()
  }, [])

  const fetchBorrowingHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/borrowings/history")
      if (!response.ok) throw new Error("Failed to fetch borrowing history")
      const data = await response.json()
      setBorrowingHistory(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch borrowing history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Borrowing History</CardTitle>
        <Button variant="outline" size="icon" onClick={fetchBorrowingHistory} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              className="h-16 w-16 border-t-4 border-blue-500 border-solid rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : borrowingHistory.length === 0 ? (
          <p className="text-center text-gray-500 my-8">No borrowing history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Book Title</TableHead>
                  <TableHead className="w-[25%]">Borrow Date</TableHead>
                  <TableHead className="w-[25%]">Return Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowingHistory.map((borrowing) => (
                  <TableRow key={borrowing.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Book className="h-4 w-4 text-gray-500" />
                        <span>{borrowing.book.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(borrowing.borrowDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {borrowing.returnDate ? (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>{new Date(borrowing.returnDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Not returned
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

