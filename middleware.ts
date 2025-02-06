import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

