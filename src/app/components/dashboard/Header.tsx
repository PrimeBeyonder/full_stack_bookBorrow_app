"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { LogOut } from "@/app/api/login/action"

export function Header() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Access localStorage only on the client-side
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = async () => {
    await LogOut()
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard/user" className="text-2xl font-bold text-primary">
          BookBorrow
        </Link>
        <div className="flex-1 max-w-xl mx-4">
          <Input type="search" placeholder="Search for books..." className="w-full" />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>

            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>

        </div>
      </div>
    </header>
  )
}

