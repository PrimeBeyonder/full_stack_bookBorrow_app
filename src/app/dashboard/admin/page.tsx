"use client"
import { redirect, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/app/action"
import { useEffect, useState } from "react"
export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = async () => {
      const user = await getUser()
      if (!user || user.role !== "ADMIN") {
        router.push("/dashboard/user")
      }
      setIsLoading(false)
    }

    checkAdminAccess()
  }, [router])
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the admin dashboard. Here you can manage users, books, and other system settings.</p>
          {/* Add more admin functionality here */}
        </CardContent>
      </Card>
    </div>
  )
}
