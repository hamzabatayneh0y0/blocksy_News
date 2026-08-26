
import { NextRequest, NextResponse } from "next/server";
import  prisma from "@/lib/db";
import { autoCompleteTagSchema } from "@/utils/validationSchemas";




/**
 *  @method  GET
 *  @route   ~ /api/tags/search

 *  @desc    Get tags autocomplete
 *  @access  public
 */

export async function GET(req: NextRequest) {
  try {


     
    const tagParam = req.nextUrl.searchParams.get("tag")||""

    if(tagParam.replace(/\s/g, "")?.length<1){
    return NextResponse.json(
             { message: "tag should be at least 1 character" },
             { status: 400 },
           );
    }
      const validation = autoCompleteTagSchema.safeParse({
        tag:tagParam
         });
     
         if (!validation.success) {
           return NextResponse.json(
             { message: validation.error.errors[0].message },
             { status: 400 },
           );
         }
     
         const { tag } = validation.data;

    

 

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains:  tag ,
          mode: "insensitive",
        },
      },
      select: {
        
        name: true,
         _count: {
      select: {
        articles: true,
      },
    },
       
      },
      
      orderBy: {
        name: "asc",
      }
    ,
   
    });
  const result = tags.map((tag) => ({
  name: tag.name,
  count: tag._count.articles,
}));
    return NextResponse.json(
      result,
      
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/tags error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while fetching tags",
      },
      { status: 500 }
    );
  }
}