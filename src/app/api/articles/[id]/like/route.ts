import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method  POST
 * @route   ~/api/articles/:id/like
 * @desc    Set article like state
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

    if (typeof body.isLiked !== "boolean") {
      return NextResponse.json(
        { message: "isLiked must be a boolean" },
        { status: 400 },
      );
    }

    const userId = parseInt(user.id);

    if (body.isLiked) {
      await prisma.articleLike.upsert({
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
        { message: "liked", isLiked: true },
        { status: 200 },
      );
    }

    await prisma.articleLike.deleteMany({
      where: {
        userId,
        articleId,
      },
    });

    return NextResponse.json(
      { message: "like removed", isLiked: false },
      { status: 200 },
    );
  } catch (error) {
    console.error("setArticleLike", error);

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
      { message: "internal server error" },
      { status: 500 },
    );
  }
}