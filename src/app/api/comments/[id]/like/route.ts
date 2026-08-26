import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { createOrUpdateActionNotification } from "@/utils/services/notification.service";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method POST
 * @route  ~/api/comments/:id/like
 * @desc   Like / unlike comment by id
 * @access Only logged-in users
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

    const commentId = parseInt((await params)?.id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { message: "invalid comment id" },
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
    const comment = await prisma.comment.findUnique({
  where: {
    id: commentId,
  },
  select: {
    userId: true,
    articleId: true,
  },
});

if (!comment) {
  return NextResponse.json(
    { message: "comment not found" },
    { status: 404 },
  );
}

    if (body.isLiked) {
      await prisma.commentLike.upsert({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
          create: {
          userId,
          commentId,
        },
          update: {},

      });
      await createOrUpdateActionNotification({
  recipientId: comment.userId.toString(),
  actorId: user.id,

  entityType: "comment",
  entityId: commentId.toString(),

  action: "like",

  type: "COMMENT_LIKE",

  url: `/articles/${comment.articleId}#comment-${commentId}`,
});

      return NextResponse.json({ message: "liked" }, { status: 201 });
    }

    await prisma.commentLike.deleteMany({
      where: {
    
          userId,
          commentId,
        
      },
    });
    await createOrUpdateActionNotification({
  recipientId: comment.userId.toString(),
  actorId: user.id,

  entityType: "comment",
  entityId: commentId.toString(),

  action: "like",

  type: "COMMENT_UNLIKE",

  url: `/articles/${comment.articleId}#comment-${commentId}`,
});

    return NextResponse.json({ message: "Like removed" });
  } catch (error) {
    console.error("likeComment", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2025")
    ) {
      return NextResponse.json(
        { message: "comment or like not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
}