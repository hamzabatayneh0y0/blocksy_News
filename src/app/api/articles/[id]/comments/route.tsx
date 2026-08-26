import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { Comment } from "@/utils/types";
interface Props {
  params: Promise<{ id: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/articles/[:id]/comments
 *  @desc    Get Articles By Page Number
 *  @access  public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    const page = Math.max(parseInt(pageNumber || "") || 1, 1);
    const articleId = parseInt((await params)?.id);
    const session = await auth();

    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    if (isNaN(articleId)) {
      return NextResponse.json(
        { message: "invalid article id" },
        { status: 400 },
      );
    }

    const [comments, totalComments] = await Promise.all([
      prisma.comment.findMany({
        where: {
          articleId,
          parentId: null,
        },
        skip: ARTICLE_PER_PAGE * (page - 1),
        take: ARTICLE_PER_PAGE,
        orderBy: { createdAt: "desc" },
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
              rootReplies: true,
              likes: true,
            },
          },

          parent: {
            select: {
              id: true,

              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.comment.count({
        where: {
          articleId,
          parentId: null,
        },
      }),
    ]);

    const formattedComments = comments.map((comment) => {
      const { rootReplies, ...count } = comment._count;
      return {
        ...comment,
        _count: {
          ...comment._count,
          replies: comment._count.rootReplies,
        },
        isLiked: comment.likes?.length > 0,
      };
    });

    return NextResponse.json(
      {
        comments: formattedComments as Comment[],
        currentPage: page,
        totalPages: Math.ceil(totalComments / ARTICLE_PER_PAGE),
        totalComments,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("getArticle-CommentsError", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}
