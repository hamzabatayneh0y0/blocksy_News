import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { UpdateCommentDto } from '@/utils/dtos';
import { GlobalRateLimit } from '@/utils/globalratelimite';
import { auth } from '@/auth';
import { updateCommentSchema } from '@/utils/validationSchemas';
import { Prisma } from '@prisma/client';

interface Props {
   params: Promise<{ id: string }> 
}

/**
 *  @method  PUT
 *  @route   ~/api/comments/:id
 *  @desc    Update Comment
 *  @access  private (only owner of the comment)
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {


      const sesssion=await auth()
                     const user= sesssion?.user
                const allowed = await GlobalRateLimit(request, user);
              
              if (!allowed) {
                return Response.json(
                  { message: "Too many requests, please try again later" },
                  { status: 429 }
                );
              }
          if (!user ) {
            return NextResponse.json(
                { message: 'only logged in user, access denied' },
                { status: 401 }
            )
        }
          
           const commentId = parseInt((await params)?.id);
if (isNaN(commentId)) {
  return NextResponse.json({ message: "invalid comment id" }, { status: 400 });
}

        const comment = await prisma.comment.findUnique({ where: { id: commentId },select:{id:true,userId:true} });
        if (!comment) {
            return NextResponse.json({ message: 'comment not found' }, { status: 404 });
        }
         if ( parseInt(user.id) !== comment.userId) {
            return NextResponse.json(
                { message: 'you are not allowed, access denied' },
                { status: 403 }
            )
        }



        const body = await request.json() as UpdateCommentDto;
        
                const validation =updateCommentSchema.safeParse(body);
                if(!validation.success) {
                    return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
                }
        
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { text: body.text }
        });

        return NextResponse.json(updatedComment, { status: 200 });

    } catch (error:any) {
          console.error("updateCommentError",error)


              
                 
        return NextResponse.json(
            { message: 'something went wrong'  },
            { status: 500 }
        )
    }
}

/**
 *  @method  DELETE
 *  @route   ~/api/comments/:id
 *  @desc    Delete Comment
 *  @access  private (only admin OR owner of the comment)
 */
export async function DELETE(request: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
      const sesssion=await auth()
                     const user= sesssion?.user
                const allowed = await GlobalRateLimit(request, user);
              
              if (!allowed) {
                return Response.json(
                  { message: "Too many requests, please try again later" },
                  { status: 429 }
                );
              }
          if (!user ) {
            return NextResponse.json(
                { message: 'only logged in user, access denied' },
                { status: 401 }
            )
        }
          
           const commentId = parseInt((await params)?.id);
if (isNaN(commentId)) {
  return NextResponse.json({ message: "invalid comment id" }, { status: 400 });
}
       const comment = await prisma.comment.findUnique({ where: { id: commentId },select:{id:true,userId:true} });
        if (!comment) {
            return NextResponse.json({  message: 'comment not found' }, { status: 404 });
        } 

     
       

        if (user.isAdmin ||parseInt( user.id) === comment.userId) {
            await prisma.comment.delete({ where: { id: commentId} });
            return NextResponse.json(
                { message: 'comment deleted' },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { message: 'you are not allowed, access denied' },
            { status: 403 }
        )
    } catch (error:any) {
         console.error("deleteCommentError",error)

             
                    
        return NextResponse.json(
            { message: 'something went wrong'  },
            { status: 500 }
        )
    }
}