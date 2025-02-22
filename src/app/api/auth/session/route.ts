// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

// This handles GET requests to /api/auth/session
export async function GET(req: NextRequest) {
  const session = await getSession({ req }); // This fetches the session from cookies

  if (session) {
    return NextResponse.json(session, { status: 200 }); // Return the session data if authenticated
  } else {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 }); // Return error if not authenticated
  }
}
