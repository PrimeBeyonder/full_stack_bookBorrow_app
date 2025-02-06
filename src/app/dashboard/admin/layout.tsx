import type React from "react"
import { Sidebar } from "../../components/dashboard/SlideBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">{children}</main>
    </div>
  )
}
