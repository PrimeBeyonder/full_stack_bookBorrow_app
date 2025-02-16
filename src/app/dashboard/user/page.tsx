"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getUser } from "@/app/api/login/action"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { UserStats } from "@/app/components/dashboard/UserStats"
import { BorrowedBooks } from "@/app/components/dashboard/BorrowedBook"
import { Wishlist } from "@/app/components/dashboard/WishList"

export default function UserProfilePage() {
  interface User {
    name: string | null;
    email: string;
    bio: string | null;
    id: string;
    avatar: string | null;
    role: Role;
    availability: number;
  }

  interface Book {
    id: string;
    title: string;
    author: string;
    coverImage: string;
  }
  type UserStats = {
  borrowedCount?: number
  wishlistCount?: number
}
  const [user, setUser] = useState<User | null>(null)
  const [wishlist, setWishlist] = useState<Book[]>([])
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData as User)
        setFormData({
          name: userData.name || "",
          email: userData.email,
          bio: userData.bio || "",
        })
        fetchWishlist(userData.id) // Fetch wishlist after setting user
        fetchBorrowedBooks(userData.id)
        fetchUserStats()
      } else {
        router.push("/login")
      }
    }

    const fetchUserStats = async () => {
      try {
        const response = await fetch(`/api/user-status`)
        if (!response.ok) throw new Error("Failed to fetch user stats")

        const data = await response.json()
        console.log("API Response:", data) // Debugging
        const formattedData = {
          borrowedCount: data.borrowedBooks,
          wishlistCount: data.wishListCount,
        }
        console.log("Formatted Data:", formattedData) // Debugging
        setUserStats(formattedData);
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
        if (!Array.isArray(data)) {
          console.error("Unexpected response structure:", data)
          return
        }

        // Map API response to match expected structure
        const formattedBooks = data.map((book: Book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage || "/placeholder.svg",
        }));
        setBorrowedBooks(formattedBooks);
      } catch (error) {
    console.error("Error fetching wishlist:", error);
    toast({
      title: "Error",
      description: "Failed to load wishlist",
      variant: "destructive",
    });
  }
  }
const fetchWishlist = async (userId: string) => {
  try {
    const response = await fetch(`/api/wishlist?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch wishlist");

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected response structure:", data);
      return;
    }

    // Map API response to match expected structure
    const formattedBooks = data.map((book: Book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage || "/placeholder.svg",
      availableCopies: book.availableCopies ?? 0, // Ensure a valid number
    }));
    setWishlist(formattedBooks);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    toast({
      title: "Error",
      description: "Failed to load wishlist",
      variant: "destructive",
    });
  }
};
    fetchUserData()
  }, [router, toast])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8">
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
                className="rounded-full border-4 border-blue-500"
              />
              <div className="flex justify-between flex-1">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <Link href="/dashboard/user/profile/edit">
                    <Button variant="outline" className=" text-blue-700">Edit Profile</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <UserStats
          borrowedCount={userStats?.borrowedCount ?? 0}
          wishlistCount={userStats?.wishlistCount ?? 0}
          reviewCount={0}
        />

        {/* Books and Wishlist Tabs */}
        <Tabs defaultValue="borrowed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="borrowed">Borrowed Books</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>
          <TabsContent value="borrowed">
            <BorrowedBooks books={borrowedBooks} />
          </TabsContent>
          <TabsContent value="wishlist">
            <Wishlist books={wishlist} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
