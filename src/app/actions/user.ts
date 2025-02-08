"use server"

import { cookies } from "next/headers"
import { prisma } from "@/app/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function updateUserProfile(formData: FormData) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) {
    return { error: "Not authenticated" }
  }

  try {
    let avatarPath = null

    const avatarFile = formData.get("avatar") as File
    if (avatarFile && avatarFile.name) {
      const bytes = await avatarFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${avatarFile.name}`
      const uploadsDir = path.join(process.cwd(), "public", "uploads")
      const filePath = path.join(uploadsDir, fileName)

      // Create the uploads directory if it doesn't exist
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (err) {
        console.error("Error creating uploads directory:", err)
        return { error: "Failed to create uploads directory" }
      }

      // Write the file
      try {
        await writeFile(filePath, buffer)
        avatarPath = `/uploads/${fileName}`
      } catch (err) {
        console.error("Error writing file:", err)
        return { error: "Failed to save avatar file" }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: sessionId },
      data: {
        name: formData.get("name") as string,
        bio: formData.get("bio") as string,
        ...(avatarPath && { avatar: avatarPath }),
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
    console.error("Failed to update profile:", error)
    return { error: "Failed to update profile" }
  }
}

