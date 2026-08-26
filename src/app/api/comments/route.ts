import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateCommentDto } from '@/utils/dtos';
import { createCommentSchema } from '@/utils/validationSchemas';
import { GlobalRateLimit } from '@/utils/globalratelimite';
import { auth } from '@/auth';
import { Prisma } from '@prisma/client';
import { Comment } from '@/utils/types';
import { createUserNotification } from '@/utils/services/notification.service';


/**
 *  @method  POST
 *  @route   ~/api/comments
 *  @desc    Create New Comment
 *  @access  private (only logged in user)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    const allowed = await GlobalRateLimit(request, user);

    if (!allowed) {
      return Response.json(
        { message: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "only logged in user, access denied" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CreateCommentDto;

    const validation = createCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    let notificationRecipientId: number | null = null;

if (body.parentId) {
  const parentComment = await prisma.comment.findUnique({
    where: {
      id: body.parentId,
    },
    select: {
      userId: true,
    },
  });

  notificationRecipientId = parentComment?.userId ?? null;
} 


    const result = await prisma.comment.create({
      data: {
        text: body.text,
        articleId: body.articleId,
        userId: parseInt(user.id),
        parentId: body.parentId,
         rootId: body.rootId,
      },

      select: {
        id: true,
        text: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },

        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },

        parent: {
          select: {
            id:true,
            user: {
              select: {
                
                name: true,
              },
            },
          },
        },
      },
    });

    const newComment = {
      ...result,
      isLiked: false,
    };

    if (
  notificationRecipientId !== null &&
  notificationRecipientId !== parseInt(user.id)
) {
  await createUserNotification({
    recipientId: notificationRecipientId.toString(),
    actorId: user.id,

    type:  "COMMENT_REPLY",


    entityId: result.id.toString(),
    entityType: "reply",
   

    url: `/articles/${body.articleId}#comment-${body.parentId }`,
  });
}

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error("createCommentError", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2025")
    ) {
      return NextResponse.json(
        { message: "article or comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}

// /**
//  *  @method  GET
//  *  @route   ~/api/comments
//  *  @desc    Get All Comments
//  *  @access  private (only admin)
//  */
// export async function GET(request: NextRequest) {
//     try {
      
    
//       const sesssion=await auth()
//                const user= sesssion?.user
//             const allowed = await GlobalRateLimit(request, user);
        
//         if (!allowed) {
//           return Response.json(
//             { message: "Too many requests, please try again later" },
//             { status: 429 }
//           );
//         }
//         if(!user || !user.isAdmin) {
//            return NextResponse.json(
//             { message: 'only admin, access denied' },
//             { status: 403 }
//            )
//         }

//         const comments = await prisma.comment.findMany();
//         return NextResponse.json(comments, { status: 200 });

//     } catch (error) {
//         return NextResponse.json(
//             { message: 'something went wrong' },
//             { status: 500 }
//         )
//     }
// }