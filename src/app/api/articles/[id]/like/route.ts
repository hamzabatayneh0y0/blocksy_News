import { NextRequest, NextResponse } from "next/server";
import prisma from '@/utils/db';
import { verifyToken } from "@/utils/verifyToken";




interface Props {
     params: Promise<{ id: string; }>; 
}


/**
 *  @method  Post
 *  @route   ~/api/articles/:id/like
 *  @desc  like Article By Id
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
  const articleId = Number((await params)?.id)
 

  const existingLike = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
              userId:user.id,
        articleId,
      },
    },
  });

  if (existingLike) {
    await prisma.articleLike.delete({
      where: {
        userId_articleId: {
               userId:user.id,

          articleId,
        },
      },
    });

    return NextResponse.json({ message: "Like removed" });
  }

  const like = await prisma.articleLike.create({
    data: {
      userId:user.id,
      articleId,
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

