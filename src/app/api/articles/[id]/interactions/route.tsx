import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 *  @method  Get
 *  @route   ~/api/articles/:id/interactions
 *  @desc    get interactions By ArticleId
 *  @access    public
 */

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const articleId = parseInt((await params).id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { message: "Invalid article ID" },
        { status: 400 },
      );
    }

    const session = await auth();

    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    if (session?.user?.id && isNaN(userId!)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        _count: {
          select: {
            likes: true,
            bookmarks: true,
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

          bookmarks: {
            where: {
              userId,
            },
            select: {
              id: true,
            },
          },
        }),
      },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      likesCount: article._count.likes,
      isLiked: userId ? article.likes.length > 0 : false,
      isBookmarked: userId ? article.bookmarks.length > 0 : false,
      savedCount: article._count.bookmarks,
    });
  } catch (error) {
    console.error("getArticleInteractions:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
