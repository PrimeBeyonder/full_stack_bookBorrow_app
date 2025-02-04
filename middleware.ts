import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const user = await prisma.user.findUnique({
    where: { id: session.value },
    select: { id: true, role: true },
  })

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Add user info to the request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", user.id)
  requestHeaders.set("x-user-role", user.role)

  // You can also redirect based on user role if needed
  if (request.nextUrl.pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/user", request.url))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: "/dashboard/:path*",
}

