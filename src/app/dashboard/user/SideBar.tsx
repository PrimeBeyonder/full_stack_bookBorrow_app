"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Book, BookOpen, Heart, Settings, Home, Search } from "lucide-react"
import { getUser } from "@/app/api/login/action"
import Image from "next/image"

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function UserSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  type User = {
    name: string | null;
    email: string;
    avatar: string | null;
  };

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
      }
    }
    fetchUser()
  }, [])

  const routes = [
    {
      label: "User Settings",
      icon: Home,
      href: "/dashboard/user",
    },
    {
      label: "Explore",
      icon: Search,
      href: "/dashboard/user/books",
    },
    {
      label: "Borrowed",
      icon: BookOpen,
      href: "/dashboard/user/borrowed",
    },
    {
      label: "Wishlist",
      icon: Heart,
      href: "/dashboard/user/wishlist",
    },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {user && (
        <div className="flex items-center space-x-4 mb-6">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name || "User Avatar"}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )}
      <nav className="space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

