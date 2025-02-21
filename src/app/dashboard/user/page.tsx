"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getUser } from "@/app/api/login/action"
import { useToast } from "@/hooks/use-toast"
import { UserStats } from "@/app/components/dashboard/UserStats"
import { BorrowedBooks } from "@/app/components/dashboard/BorrowedBook"
import { Wishlist } from "@/app/components/dashboard/WishList"

interface User {
  name: string | null
  email: string
  bio: string | null
  id: string
  avatar: string | null
  role: string
  availability: number
}

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  dueDate?: string
  status?: string
}

interface UserStats {
  borrowedCount: number
  wishlistCount: number
}

export default function UserProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null")
  const [user, setUser] = useState<User | null>(null)
  const [wishlist, setWishlist] = useState<Book[]>([])
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([])
  const [userStats, setUserStats] = useState<UserStats>({ borrowedCount: 0, wishlistCount: 0 })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData as User)
        fetchWishlist(userData.id)
        fetchBorrowedBooks(userData.id)
        fetchUserStats()
      } else {
        router.push("/login")
      }
    }

    fetchUserData()
  }, [router])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/user-status`)
      if (!response.ok) throw new Error("Failed to fetch user stats")
      const data = await response.json()
      setUserStats({
        borrowedCount: data.borrowedBooks,
        wishlistCount: data.wishListCount,
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      toast({
        title: "Error",
        description: "Failed to load user stats",
        variant: "destructive",
      })
    }
  }

  const fetchBorrowedBooks = async (userId: string) => {
    try {
      const response = await fetch(`/api/books?userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch borrowed books")
      const data = await response.json()
      const formattedBooks = data.map((book: Book) => ({
        ...book,
        coverImage: book.coverImage || "/placeholder.svg",
        status: "BORROWED", // Add status here
      }))
      setBorrowedBooks(formattedBooks)
    } catch (error) {
      console.error("Error fetching borrowed books:", error)
      toast({
        title: "Error",
        description: "Failed to load borrowed books",
        variant: "destructive",
      })
    }
  }

  const fetchWishlist = async (userId: string) => {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch wishlist")
      const data = await response.json()
      const formattedBooks = data.map((book: Book) => ({
        ...book,
        coverImage: book.coverImage || "/placeholder.svg",
      }))
      setWishlist(formattedBooks)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  const refreshBooks = async () => {
    if (user) {
      await fetchBorrowedBooks(user.id)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Image
              src={user.avatar || "/user_avatar.jpg"}
              alt={user.name || "User Avatar"}
              width={100}
              height={100}
              className="rounded-full border-4 border-primary"
            />
            <div className="flex justify-between flex-1">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Link href="/dashboard/user/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserStats borrowedCount={userStats.borrowedCount} wishlistCount={userStats.wishlistCount} reviewCount={0} />

      <Tabs defaultValue="borrowed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="borrowed">Borrowed Books</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="borrowed">
          <BorrowedBooks 
            books={borrowedBooks} 
            onBookReturned={refreshBooks} 
            userId={currentUser?.id || ""}
          />
        </TabsContent>
        <TabsContent value="wishlist">
          <Wishlist books={wishlist} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

