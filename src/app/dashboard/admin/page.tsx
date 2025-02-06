import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const headersList = headers()
  const userRole = headersList.get("x-user-role")

  if (userRole !== "ADMIN") {
    redirect("/dashboard/user")
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
