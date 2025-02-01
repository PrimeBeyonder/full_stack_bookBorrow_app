import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const genres = [
    "Fiction",
    "Non-fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Horror",
    "Biography",
    "History",
    "Self-help",
    "Business",
    "Children's",
    "Young Adult",
    "Poetry",
  ]

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre },
      update: {},
      create: { name: genre },
    })
  }

  console.log("Genres seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

