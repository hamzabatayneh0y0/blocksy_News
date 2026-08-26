import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";

import { Article, ForYouTag } from "@/utils/types";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method  GET
 * @route   ~/api/users/profile/:id/forYou
 * @desc    Get user ForYou articles
 * @access  private
 */


export async function GET(req:NextRequest,{ params }: Props) {


try {
          const { id } = await params;

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }
   
    


    const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
  select: {
    forYou: true,
  },
});

if (!user) {
  return [];
}

const forYouTags = user.forYou as ForYouTag[];

const tagNames = forYouTags.map((tag) => tag.name);

if (tagNames.length === 0) {
  return [];
}

const articles = await prisma.article.findMany({
  where: {
    articleTags: {
      some: {
        tag: {
          name: {
            in: tagNames,
          },
        },
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 3,

      select: {
      id: true,
      title: true,
      description: true,
      imageUrl:true,
      createdAt: true,
       _count: {
          select: {
            likes: true,
            bookmarks: true,
          },
        },
      articleTags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
});

  const result:Article[] = articles.map(({ articleTags, _count, ...article }) => ({
    ...article,
    tags: articleTags.map(({ tag }) => tag.name),
    likesCount: _count.likes,
      savedCount: _count.bookmarks,
  }));
  return NextResponse.json(
     
      result ,
      
     { status: 200 }
   );
 } catch (error) {
   console.error("ForYouArticles", error);
 
   return NextResponse.json(
     { message: "Something went wrong" },
     { status: 500 }
   );
 }

    
}