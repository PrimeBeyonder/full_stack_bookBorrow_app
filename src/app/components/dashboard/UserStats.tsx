import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, BookMarked, Star } from "lucide-react"

interface UserStatsProps {
  borrowedCount: number
  wishlistCount: number
  reviewCount: number
}

export function UserStats({ borrowedCount, wishlistCount, reviewCount }: UserStatsProps) {
  const stats = [
    {
      title: "Books Borrowed",
      value: borrowedCount,
      icon: Book,
    },
    {
      title: "Wishlist",
      value: wishlistCount,
      icon: BookMarked,
    },
    {
      title: "Reviews",
      value: reviewCount,
      icon: Star,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

