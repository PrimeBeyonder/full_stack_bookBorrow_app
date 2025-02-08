import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash("adminpassword", 10)
  const userPassword = await hash("userpassword", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Book Mangement Admin",
      email: "admin@example2.com",
      password: adminPassword,
      role: Role.ADMIN,
      bio: "Library administrator",
      avatar: null,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: "user@example2.com" },
    update: {},
    create: {
      name: "Andrew Thomas",
      email: "user@example.com",
      password: userPassword,
      role: Role.USER,
      bio: "Avid reader and book enthusiast",
      avatar: null,
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