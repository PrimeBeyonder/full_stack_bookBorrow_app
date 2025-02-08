"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileEdit } from "@/app/components/dashboard/ProfileEdit"
import { getUser } from "@/app/api/login/action"


export default function EditProfilePage() {
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

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <ProfileEdit user={user} />
    </div>
  )
}
