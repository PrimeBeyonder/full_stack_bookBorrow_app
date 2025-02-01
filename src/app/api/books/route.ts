import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const author = searchParams.get("author");
    const genre = searchParams.get("genre");
    
    const where = {
        ...(title && { title: { contains: title, mode: "insensitive" } }),
        ...(author && { author: { contains: author, mode: "insensitive" } }),
        ...(genre && { genre: { has : genre } }),
    }

    const books = await prisma.books.findMany({
        where: where
    })
    if(!books) {
        return new Response("No books found", { status: 404 })
    }

    return Response.json(books, { status: 200 })
}

export async function POST(request:Request) {  
    const body = await request.json()
    const book = await prisma.books.create({
        data: body
    })
    return Response.json(book, { status: 200 })
    
}