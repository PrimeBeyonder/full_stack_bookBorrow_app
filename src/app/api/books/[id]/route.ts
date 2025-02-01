import {prisma} from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request:Request, {params}: {params :{id: string}}) {  
    const book = await prisma.books.findUnique({
        where: {
            id: params.id
        }
    })
    if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    return NextResponse.json(book)
}

export async function PUT(request:Request, {params}: {params :{id: string}}) {  
    const body = await request.json()
    const book = await prisma.books.update({
        where: {id : params.id},
        data: body
    })
    return NextResponse.json(book, { status: 200 })
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await prisma.book.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Book deleted successfully" })
}