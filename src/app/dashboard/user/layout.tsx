import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">{children}</main>
    </div>
  )
}
