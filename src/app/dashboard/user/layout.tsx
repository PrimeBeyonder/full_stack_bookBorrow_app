import type React from "react"
import { UserSidebar } from "./SideBar"
import { Header } from "@/app/components/dashboard/Header"

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <UserSidebar className="w-full md:w-1/4" />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
