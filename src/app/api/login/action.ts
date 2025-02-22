"use server"

import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma"; // Ensure Prisma client is initialized correctly
import { compare } from "bcryptjs";
import { getServerSession } from "next-auth/next"; // Using NextAuth's session helper
import { authOptions } from "@/lib/auth"; // Your NextAuth configuration

export async function login(email: string, password: string) {
  // Step 1: Fetch the user from the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Step 2: Validate user and password
  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid email or password" };
  }

  // Step 3: Set the session cookie for this user
  const cookieStore = await cookies(); // Cookies API for setting cookies
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 1 week
    path: "/",
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
    },
  };
}

export async function logout() {
  // Clear the session cookie
  const cookieStore = await cookies();
  cookieStore.delete({ name: "session", path: "/" }); // Delete session cookie
}

export async function getUser() {
  // Attempt to get session via NextAuth's getServerSession
  const session = await getServerSession(authOptions);

  // If session exists, return user from the session
  if (session?.user) {
    return session.user;
  }

  // Otherwise, manually check the cookies for the session ID
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return null; // No session, return null
  }

  // Find the user by session ID (stored in cookie)
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      avatar: true,
      bio: true,
    },
  });

  return user; // Return the user data if found
}
