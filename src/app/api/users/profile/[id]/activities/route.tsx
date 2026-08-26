import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

import { auth } from "@/auth";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method  GET
 * @route   ~/api/users/profile/:id/activities
 * @desc    Get user activities
 * @access  private
 */

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in" },
        { status: 401 },
      );
    }

    const sessionUserId = parseInt(session.user.id);

    if (isNaN(sessionUserId)) {
      return NextResponse.json(
        { message: "Invalid session user ID" },
        { status: 401 },
      );
    }

    if (sessionUserId !== userId) {
      return NextResponse.json(
        {
          message: "Only the account owner can access this profile",
        },
        { status: 403 },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const type = searchParams.get("type");

    const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1");

    if (!type || !["bookmarks", "articleLikes", "comments"].includes(type)) {
      return NextResponse.json(
        {
          message: "Invalid type. Use bookmarks, articleLikes or comments",
        },
        { status: 400 },
      );
    }

    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 },
      );
    }

    const limit = 10;
    const skip = (pageNumber - 1) * limit;

    let data;

    switch (type) {
      case "bookmarks": {
        const bookmarks = await prisma.bookmark.findMany({
          where: {
            userId,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            article: {
              select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                imageUrl: true,
                articleTags: {
                  select: {
                    tag: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                _count: {
                  select: {
                    likes: true,
                    bookmarks: true,
                  },
                },
              },
            },
          },
        });

        data = bookmarks.map((bookmark) => ({
          ...bookmark.article,
          tags: bookmark.article.articleTags.map(({ tag }) => tag.name),
          likesCount: bookmark.article._count.likes,
          savedCount: bookmark.article._count.bookmarks,
        }));

        break;
      }

      case "articleLikes": {
        const articleLikes = await prisma.articleLike.findMany({
          where: {
            userId,
          },

          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            article: {
              select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                imageUrl: true,
                articleTags: {
                  select: {
                    tag: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                _count: {
                  select: {
                    likes: true,
                    bookmarks: true,
                  },
                },
              },
            },
          },
        });

        data = articleLikes.map((articleLike) => ({
          ...articleLike.article,
          tags: articleLike.article.articleTags.map(({ tag }) => tag.name),
          likesCount: articleLike.article._count.likes,
          savedCount: articleLike.article._count.bookmarks,
        }));

        break;
      }

      case "comments": {
        data = await prisma.comment.findMany({
          where: {
            userId,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            text: true,
            createdAt: true,
            article: {
              select: {
                id: true,
              },
            },
          },
        });

        break;
      }
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("getUserActivities:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
