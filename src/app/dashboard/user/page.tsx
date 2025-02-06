"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser,logout  } from "@/app/action"
import { Button } from "@/components/ui/button"

export default function UserDashboard() {
  interface User {
    name: string | null;
    id: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    role: Role;
  }
  
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
      } else {
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name || "User avatar"}
              width={120}
              height={120}
              className="rounded-full"
            /> */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <p className="text-gray-800 mb-4 max-w-md">{user.bio || "No bio available"}</p>
              <div className="flex justify-center md:justify-start space-x-4">
                <div className="text-center">
                  <span className="text-2xl font-bold">0</span>
                  <p className="text-gray-600">Books Read</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold">0</span>
                  <p className="text-gray-600">Reviews</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold">0</span>
                  <p className="text-gray-600">Wishlist</p>
                </div>
              </div>
              <Button onClick={handleLogout} className="mt-4">
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

