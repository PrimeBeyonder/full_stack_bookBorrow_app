import { NextResponse } from "next/server";
import { getUser } from "@/app/api/login/action";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    const user = await getUser();
    
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const borrowedBooks = await prisma.borrowing.count({
            where: {
                userId: user.id,
                status: "BORROWED",
            }
        })

        const wishListCount = await prisma.wishlistItem.count({
            where: {
                userId: user.id,
            }
        })
        const stats = {
            borrowedBooks,
            wishListCount,
        }

        return NextResponse.json(stats)
    } catch {
        console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
    }
}