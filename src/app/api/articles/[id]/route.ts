import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { GlobalRateLimit } from "@/utils/globalratelimite";
import { auth } from "@/auth";
import { updateArticleSchema } from "@/utils/validationSchemas";
import cloudinary from "@/lib/cloudinary";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { qstash } from "@/lib/qstash";
import { DOMAIN, QDomain } from "@/utils/constants";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/articles/:id
 *  @desc    Get Single Article By Id
 *  @access  public
 */
export async function GET(req: NextRequest, { params }: Props) {
  
  try {
    const { id } = await params;

    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { message: "invalid article id" },
        { status: 400 },
      );
    }
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
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
    if (!article) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 },
      );
    }

      const { articleTags, ...articleWithoutTags } = article;

    const articleResult = {
      ...articleWithoutTags,
      tags: articleTags.map(({ tag }) => tag.name),
    };

           const session= await auth()

           if(session?.user?.id)
             {
     
try {
  await qstash.publishJSON({
    url: `${QDomain}/api/workers/update-foryou`,
    body: {
      userId: session?.user?.id,
      articleTags: articleResult.tags,
    },
  });
} catch (error) {
  console.error("Failed to publish For You job:", error);
}
             }
  
    const recommendations = await prisma.article.findMany({

      where: {
        id: {
          not: articleId,
        },
        articleTags: {
          some: {
            tag: {
              name: {
                in: articleResult.tags,
              },
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
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
      take: 3,
      orderBy: {
       
        createdAt: "desc",
      },
    });




    const recommendationsResult = recommendations.map(
      ({ articleTags, ...article }) => ({
        ...article,
        tags: articleTags.map(({ tag }) => tag.name),
      }),
    );

    return NextResponse.json(
      { articleResult, recommendationsResult },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("getArticle", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

/**
 *  @method  PUT
 *  @route   ~/api/articles/:id
 *  @desc    Update Article
 *  @access  private (only admin can update article)
 */
export async function PUT(request: NextRequest, { params }: Props) {

  try {
  const { id } = await params;

    const sesssion = await auth();
    const user = sesssion?.user;
    const allowed = await GlobalRateLimit(request, user);

    if (!allowed) {
      return Response.json(
        { message: "Too many requests, please try again later" },
        { status: 429 },
      );
    }
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 },
      );
    }
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { message: "invalid article id" },
        { status: 400 },
      );
    }


    const body = (await request.json()) ;

    const validation = updateArticleSchema.safeParse(body) ;
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 },
      );
    }
    const { title, description } = validation.data;
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        description,
      },
      select: {
        title: true,
        description: true,
      },
    });
     revalidateTag("articles")
      revalidateTag(`article-${id}`)
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error: any) {
    console.error("updateArticleError", error);
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          (error.code === "P2003" || error.code === "P2025")
        ) {
          return NextResponse.json(
            { message: "article not found" },
            { status: 404 },
          );
        }
    
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

// /**
//  *  @method  DELETE
//  *  @route   ~/api/articles/:id
//  *  @desc    Delete Article
//  *  @access  private (only admin can delete article)
//  */
// export async function DELETE(request: NextRequest, { params }: Props) {
//   try {
//     const { id } = await params;

//     const session = await auth();
//     const user = session?.user;

//     const allowed = await GlobalRateLimit(request, user);

//     if (!allowed) {
//       return NextResponse.json(
//         { message: "Too many requests, please try again later" },
//         { status: 429 },
//       );
//     }

//     if (!user || !user.isAdmin) {
//       return NextResponse.json(
//         { message: "only admin, access denied" },
//         { status: 403 },
//       );
//     }

//     const articleId = parseInt(id);

//     if (isNaN(articleId)) {
//       return NextResponse.json(
//         { message: "invalid article id" },
//         { status: 400 },
//       );
//     }

//     const article = await prisma.article.findUnique({
//       where: {
//         id: articleId,
//       },
//       select: {
//         imagePublicId: true,
//         articleTags: {
//           select: {
//             tag: {
//               select: {
//                 id: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!article) {
//       return NextResponse.json(
//         { message: "article not found" },
//         { status: 404 },
//       );
//     }

//     const tagIds = article.articleTags.map(({ tag }) => tag.id);

//     await prisma.$transaction(async (tx) => {
//       await tx.article.delete({
//         where: {
//           id: articleId,
//         },
//       });

//       if (tagIds.length > 0) {
//         await tx.tag.deleteMany({
//           where: {
//             id: {
//               in: tagIds,
//             },
//             articles: {
//               none: {},
//             },
//           },
//         });
//       }
//     });

//     // Delete Cloudinary image after successful DB transaction
//     if (article.imagePublicId) {
//       try {
//         await cloudinary.uploader.destroy(article.imagePublicId);
//       } catch (error) {
//         console.error("deleteCloudinaryImageError", error);
//       }
//     }

//     revalidateTag("articles")

//     return NextResponse.json({ message: "article deleted" }, { status: 200 });
//   } catch (error) {
//     console.error("deleteArticleError", error);

//     return NextResponse.json(
//       { message: "something went wrong" },
//       { status: 500 },
//     );
//   }
// }
