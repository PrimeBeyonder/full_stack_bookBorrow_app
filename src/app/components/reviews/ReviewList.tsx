"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ReviewForm } from "./ReviewForm"
import { StarRating } from "./StarRating"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Trash2 } from "lucide-react"
import { getUser } from "@/app/api/login/action"
import { motion, AnimatePresence } from "framer-motion"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string
  }
}

interface ReviewListProps {
  bookId: string
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export function ReviewList({ bookId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews?bookId=${bookId}`)
      if (!response.ok) throw new Error("Failed to fetch reviews")
      const data = await response.json()
      setReviews(data)
    } catch  {
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive",
      })
    }
  }, [bookId, toast])

  useEffect(() => {
    fetchReviews()
    const fetchUser = async () => {
      const user = await getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [fetchReviews])

  const handleDelete = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete review")
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
      fetchReviews()
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="my-7">
      <AnimatePresence>
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.avatar || "/placeholder-avatar.png"} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} onRatingChange={() => {}} readonly size="sm" />
                </div>
                {editingReview === review.id ? (
                  <ReviewForm
                    bookId={bookId}
                    existingReview={review}
                    onSuccess={() => {
                      setEditingReview(null)
                      fetchReviews()
                    }}
                  />
                ) : (
                  <>
                    <p className="text-sm leading-relaxed mb-4">{review.comment}</p>
                    {currentUser?.id === review.user.id && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReview(review.id)}
                          className="flex items-center"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      {reviews.length === 0 && (
        <p className="text-center text-muted-foreground italic">No reviews yet. Be the first to share your thoughts!</p>
      )}
    </div>
  )
}

