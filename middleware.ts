import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token

    // No token means not authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Check admin routes
    if (req.nextUrl.pathname.startsWith("/dashboard/admin")) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/user", req.url))
      }
    }

    // Handle main dashboard redirect
    if (req.nextUrl.pathname === "/dashboard") {
      const redirectUrl = token.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Return false to display the error page
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
}

