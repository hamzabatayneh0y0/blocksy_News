import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/db";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Comment } from "@/utils/types";
interface Props {
  params: Promise<{ id: string }>;
}

/**
 *  @method  Get
 *  @route   ~/api/comments/[commentId]/replies
 *  @desc    get Comment replies
 *  @access  public
 */





export async function GET(request: NextRequest, { params }: Props) {
  try {
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
      const page = Math.max(parseInt(pageNumber||"") || 1, 1);
    const commentId = parseInt((await params)?.id);
    const session = await auth();

    const userId = session?.user?.id ? parseInt(session.user.id) : null;
   
          

    if (isNaN(commentId)) {
      return NextResponse.json(
        { message: "invalid comment id" },
        { status: 400 },
      );
    }

    const [comments, totalReplies] = await Promise.all([
      prisma.comment.findMany({
        where: {
          rootId:commentId,
        },
        skip: ARTICLE_PER_PAGE * (page - 1),
        take: ARTICLE_PER_PAGE,
      orderBy: { createdAt: "asc" },
        select: {
          id: true,
          text: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },

          ...(userId && {
            likes: {
              where: {
                userId,
              },
              select: {
                id: true,
              },
            },
          }),

          _count: {
            select: {
              replies: true,
              likes: true,
            },
          },
          
    parent: 
       {
          select: {
                   id:true,

            user: {
              select: {
                name: true,
              },
            },
          },
        }
        },
      }),
      prisma.comment.count({
        where: {
          rootId: commentId,
        },
      }),
    ]);
   const formattedComments = comments.map((comment) => ({
      ...comment,
      isLiked: comment.likes.length > 0,
    }));
    return NextResponse.json( {
          replies:formattedComments as Comment[],
          currentPage: page,
          totalPages: Math.ceil(totalReplies / ARTICLE_PER_PAGE),
          totalReplies,
          
        },{ status: 200 });
  } catch (error: any) {
    console.error("getreplies-CommentsError", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { message: "comment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}
