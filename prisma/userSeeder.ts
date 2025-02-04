import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash("adminpassword", 10)
  const userPassword = await hash("userpassword", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@admin.com",
      password: adminPassword,
      role: Role.ADMIN,
      bio: "Library administrator",
      avatar: "https://example.com/avatars/admin.jpg",
    },
  })

  const user = await prisma.user.upsert({
    where: { email: "user1@gmail.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "user1@gmail.com",
      password: userPassword,
      role: Role.USER,
      bio: "Avid reader and book enthusiast",
      avatar: "https://example.com/avatars/user1.jpg",
    },
  })

  console.log({ admin, user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

