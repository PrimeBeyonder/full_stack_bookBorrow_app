import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await request.cookies.get("session")
  console.log("Session in middleware:", session?.value)

  if (!session) {
    console.log("No session, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const userId = session.value

  // In a real application, you would fetch the user role from the database here
  // For this example, we'll assume all users are regular users except for a specific admin ID
  const userRole = userId === "admin_id" ? "ADMIN" : "USER"

  const response = NextResponse.next()

  // Set user info in the headers
  response.headers.set("x-user-id", userId)
  response.headers.set("x-user-role", userRole)

  console.log("User ID:", userId, "User Role:", userRole)

  // Handle specific routes
  if (request.nextUrl.pathname === "/dashboard") {
    console.log("Redirecting to role-based dashboard")
    return NextResponse.redirect(new URL(`/dashboard/${userRole.toLowerCase()}`, request.url))
  }

  if (request.nextUrl.pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    console.log("Non-admin trying to access admin dashboard, redirecting")
    return NextResponse.redirect(new URL("/dashboard/user", request.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
}

