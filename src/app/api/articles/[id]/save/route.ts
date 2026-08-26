import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method  POST
 * @route   ~/api/articles/:id/save
 * @desc    Set article bookmark state
 * @access  only logged in users
 */
export async function POST(req: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { message: "only logged in user, access denied" },
        { status: 401 },
      );
    }

    const articleId = parseInt((await params).id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { message: "invalid article id" },
        { status: 400 },
      );
    }

    const body = await req.json();

    if (typeof body.isBookmarked !== "boolean") {
      return NextResponse.json(
        { message: "isBookmarked must be a boolean" },
        { status: 400 },
      );
    }

    const userId = parseInt(user.id);

    if (body.isBookmarked) {
      await prisma.bookmark.upsert({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
        create: {
          userId,
          articleId,
        },
        update: {},
      });

      return NextResponse.json(
        {
          message: "saved",
          isBookmarked: true,
        },
        { status: 200 },
      );
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId,
        articleId,
      },
    });

    return NextResponse.json(
      {
        message: "not saved",
        isBookmarked: false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("saveArticle", error);

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