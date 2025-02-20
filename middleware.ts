import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")

  if (!session) {
    return NextResponse.redirect(new URL("auth/login", request.url))
  }

  // Get the user from the database using the session ID
  const user = await prisma.user.findUnique({
    where: { id: session.value },
    select: { role: true },
  })

  if (!user) {
    return NextResponse.redirect(new URL("auth/login", request.url))
  }

  // Check if trying to access admin routes
  if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/user", request.url))
    }
  }

  // For the main dashboard route, redirect based on role
  if (request.nextUrl.pathname === "/dashboard") {
    const redirectUrl = user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
}

