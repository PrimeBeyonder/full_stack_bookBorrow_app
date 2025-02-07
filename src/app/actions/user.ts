"use server"

import { cookies } from "next/headers"
import { prisma } from "@/app/lib/prisma"

export async function updateUserProfile(formData: FormData) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) {
    return { error: "Not authenticated" }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: sessionId },
      data: {
        name: formData.get("name") as string,
        bio: formData.get("bio") as string,
        avatar: formData.get("avatar") as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        role: true,
      },
    })

    return { user: updatedUser }
  } catch (error) {
    return { error: "Failed to update profile" }
  }
}
