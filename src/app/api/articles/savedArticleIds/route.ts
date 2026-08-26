import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/db';
import { auth } from "@/auth";


/**
 *  @method  GET
 *  @route   ~/api/articles/savedarticleids
 *  @desc    Get all saved articles ids for login user
 *  @access  public
 */
export async function GET(request: NextRequest) {
   

    try { 
       const sesssion=await auth()
          const user= sesssion?.user
             if(!user) {
            
                         return NextResponse.json([], { status: 200 }); 
                   }

        const articlesIds = await prisma.bookmark.findMany({
          where:{
               userId:parseInt(user.id)
          },
          select:{
            articleId:true
          }
        })
     
const ids=articlesIds.map(item => item.articleId)
      console.log("savedArticlesIds:", ids)

        return NextResponse.json(ids, { status: 200 });
    } catch (error:any) {
        console.log("savedArticlesIds error:", error);
        return NextResponse.json(
            { message: "something went wrong" },
            { status: 500 }
        );
    }
}

