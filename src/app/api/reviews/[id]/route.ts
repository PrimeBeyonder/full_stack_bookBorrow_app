import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUser } from "../../login/action";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const { rating, comment } = await request.json();
        const review = await prisma.review.findUnique({
            where: { id: params.id }, 
        })
        
        if (!review) {
            return NextResponse.json({error: "Review not found"}, {status: 404})
        }

        if (review.userId !== user.id && user.role !== "ADMIN") {
            return NextResponse.json({error: "Unauthroized"}, { status: 403 })
        }

        const updateReview = await prisma.review.update({
            where: { id: params.id }, 
            data: { rating, comment },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        })
        return NextResponse.json(updateReview, {status: 200})
    }catch {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser();  // Get the authenticated user
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensure params are awaited before using them
    const reviewId = await params.id;  // Await params object

    // Find the review in the database
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Ensure the user can delete the review
    if (review.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Proceed to delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Review deleted successfully" });

  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
