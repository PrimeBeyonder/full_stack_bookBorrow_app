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
  }
  
  const [user, setUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
        setFormData({
          name: userData.name || "",
          email: userData.email,
          bio: userData.bio || "",
        })
      } else {
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])


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
        <UserStats />

        {/* Books and Wishlist Tabs */}
        <Tabs defaultValue="borrowed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="borrowed">Borrowed Books</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>
          <TabsContent value="borrowed">
            <BorrowedBooks books={[]} />
          </TabsContent>
          <TabsContent value="wishlist">
            <Wishlist books={[]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

