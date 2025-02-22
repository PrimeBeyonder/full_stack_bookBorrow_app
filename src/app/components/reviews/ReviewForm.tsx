"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { StarRating } from "./StarRating"

interface ReviewFormProps {
  bookId: string
  existingReview?: {
    id: string
    rating: number
    comment: string
  }
  onSuccess: () => void
}

export function ReviewForm({ bookId, existingReview, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const url = existingReview ? `/api/reviews/${existingReview.id}` : "/api/reviews"
    const method = existingReview ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, rating, comment }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast({
        title: "Success",
        description: existingReview ? "Review updated successfully" : "Review submitted successfully",
      })
      onSuccess()
      router.refresh()
    } catch  {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StarRating rating={rating} onRatingChange={setRating} />
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here..."
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  )
}
