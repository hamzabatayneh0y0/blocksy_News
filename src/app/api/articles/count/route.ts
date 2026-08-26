import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ARTICLE_PER_PAGE } from '@/utils/constants';


/**
 *  @method  GET
 *  @route   ~/api/articles/count
 *  @desc    Get Articles Count
 *  @access  public
 */
export async function GET(request: NextRequest) {
    try {
        const count = await prisma.article.count();
        return NextResponse.json({ count, 
      totalPages: Math.ceil(count / ARTICLE_PER_PAGE),
       }, { status: 200 });
    } catch (error:any) {
          console.error("getArticlesCountError",error);
        return NextResponse.json(

            { message: "something went wrong" },
            { status: 500 }
        );
    }
}