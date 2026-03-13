import { NextRequest, NextResponse } from "next/server";
import prisma from '@/utils/db';
import { verifyToken } from "@/utils/verifyToken";




interface Props {
     params: Promise<{ id: string; }>; 
}


/**
 *  @method  Post
 *  @route   ~/api/comment/:id/like
 *  @desc  like comment By Id
 *  @access  only login users
 */
export async function POST(
  req: NextRequest,
  { params }: Props 
) {

try {
      const user = verifyToken(req);
        if(!user) {
            return NextResponse.json(
                { message: 'only logged in user, access denied' },
                { status: 401 }
            );
        }
  const commentId = Number((await params)?.id)
 

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
       userId:user.id,
       commentId,
      },
    },
  });

  if (existingLike) {
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
               userId:user.id,

          commentId,
        },
      },
    });

    return NextResponse.json({ message: "Like removed" });
  }

  const like = await prisma.commentLike.create({
    data: {
      userId:user.id,
      commentId,
    },
  });

  return NextResponse.json({message:"liked",like}, { status: 201 });
}
catch (error) {
     return NextResponse.json(
            { message: 'internal server error' },
            { status: 500 }
        )
}
}

