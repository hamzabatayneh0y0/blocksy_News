import { updateArticleTagsSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { GlobalRateLimit } from '@/utils/globalratelimite';
import { auth } from '@/auth';
import { revalidateTag } from "next/cache";

interface Props {
    params:Promise<{ id: string }>
}



 /**
  * @method  PUT
  * @route   ~/api/articles/:id/tags
  * @desc    Update Article Tags
  * @access  private (only admin can update article tags)
  */
export async function PUT(request: NextRequest, { params }: Props) {
  

  try {

    const { id } = await params;
    const session = await auth();
    const user = session?.user;

    const allowed = await GlobalRateLimit(request, user);

    if (!allowed) {
      return Response.json(
        { message: "Too many requests, please try again later" },
        { status: 429 }
      );
    }
        const articleId = parseInt(id);
if (isNaN(articleId)) {
  return NextResponse.json({ message: "invalid article id" }, { status: 400 });
}

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select:{
        id:true,
        articleTags:{
                    select:{
                        tag:{
                            select:{
                                id:true
                            }
                        }
                    }
                }
      }
    });

    if (!article) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation = updateArticleTagsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { tags } = validation.data;
const normalizedTags = tags.map((tag) => tag.toLowerCase());    

 const result = await prisma.$transaction(async (tx) => {


  const tagIds = article.articleTags.map(({ tag }) => tag.id);

  const updatedArticle = await tx.article.update({
    where: {
      id: articleId,
    },
    data: {
      articleTags: {
        deleteMany: {},
 
        create: normalizedTags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: {
                name,
              },
              create: {
                name,
              },
            },
          },
        })),
      },
    },
    select: {
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

  await tx.tag.deleteMany({
    where: {
      id: {
        in: tagIds,
      },
      articles: {
        none: {},
      },
    },
  });

  return {
    tags: updatedArticle.articleTags.map(({ tag }) => tag.name),
  };
});


 
   revalidateTag("articles")
    revalidateTag(`article-${id}`)
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("updateArticleTags",error);

    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}