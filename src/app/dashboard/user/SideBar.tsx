"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Book, BookOpen, Heart, Settings, Menu } from "lucide-react"

export function UserSidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: Book,
      href: "/dashboard/user",
    },
    {
      label: "Borrowed Books",
      icon: BookOpen,
      href: "/dashboard/user/borrowed",
    },
    {
      label: "Wishlist",
      icon: Heart,
      href: "/dashboard/user/wishlist",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/user/settings",
    },
  ]

  return (
    <>
      <Button variant="outline" className="md:hidden fixed top-4 left-4 z-50" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="h-4 w-4" />
      </Button>
      <div
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-background border-r",
          isOpen && "translate-x-0",
          "md:translate-x-0",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">User Dashboard</h2>
              <div className="space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-3 py-2">
              <h3 className="mb-2 px-4 text-lg font-semibold">Admin-Created Books</h3>
              {/* This section will be populated with admin-created books */}
              <div className="space-y-1">
                <Link
                  href="/dashboard/user/books/1"
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Book Title 1
                </Link>
                <Link
                  href="/dashboard/user/books/2"
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Book Title 2
                </Link>
                {/* Add more books as needed */}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

