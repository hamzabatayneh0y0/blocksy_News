import { NextRequest, NextResponse } from "next/server";
import { createArticleSchema, deleteManyArticlesschema } from "@/utils/validationSchemas";
import prisma from "@/lib/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { GlobalRateLimit } from "@/utils/globalratelimite";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
import { revalidateTag } from "next/cache";
import { createGlobalNotification } from "@/utils/services/notification.service";

// /**
//  *  @method  GET
//  *  @route   ~/api/articles
//  *  @desc    Get Articles By Page Number
//  *  @access  public
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
//     const sort = request.nextUrl.searchParams.get("sort") || "latest";

//     // Validate pageNumber
//     const parsedPageNumber = Number(pageNumber);

//     if (
//       !Number.isInteger(parsedPageNumber) ||
//       parsedPageNumber < 1
//     ) {
//       return NextResponse.json(
//         { message: "Invalid pageNumber" },
//         { status: 400 },
//       );
//     }

//     // Validate sort
//     const allowedSorts = ["latest", "oldest", "popular"] as const;

//     if (!allowedSorts.includes(sort.toLowerCase() as ((typeof allowedSorts)[number]))) {
//       return NextResponse.json(
//         {
//           message:
//             "Invalid sort. Allowed values are latest, oldest and popular",
//         },
//         { status: 400 },
//       );
//     }

//     const orderBy =
//       sort === "latest"
//         ? { createdAt: "desc" as const }
//         : sort === "oldest"
//           ? { createdAt: "asc" as const }
//           : { likes: { _count: "desc" as const } };

//     const articles = await prisma.article.findMany({
//       skip: ARTICLE_PER_PAGE * (parsedPageNumber - 1),
//       take: ARTICLE_PER_PAGE,

//       orderBy,

//       select: {
//         id: true,
//         title: true,
//         description: true,
//         imageUrl: true,
//         createdAt: true,

//         _count: {
//           select: {
//             likes: true,
//             bookmarks: true,
//           },
//         },

//         articleTags: {
//           select: {
//             tag: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     const result = articles.map(({ articleTags, _count, ...article }) => ({
//       ...article,
//       tags: articleTags.map(({ tag }) => tag.name),
//       likesCount: _count.likes,
//       savedCount: _count.bookmarks,
//     }));

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error("getArticlesError", error);

//     return NextResponse.json(
//       { message: "something went wrong" },
//       { status: 500 },
//     );
//   }
// }

/**
 *  @method  POST
 *  @route   ~/api/articles
 *  @desc    Create New Article
 *  @access  private (only admin can create article)
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: NextRequest) {
  try {
   
  
    const session = await auth();
    const user = session?.user;

    const allowed = await GlobalRateLimit(request, user);

    if (!allowed) {
      return NextResponse.json(
        { message: "Too many requests, please try again later" },
        { status: 429 },
      );
    }
     if (!user ) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 401 },
      );
    }

    if (user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 },
      );
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const tags = formData.get("tags");
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 },
      );
    }

    if (image.size === 0) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 },
      );
    }

    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Image size must be less than 5MB" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
      return NextResponse.json(
        {
          message:
            "Invalid image type. Only JPEG, PNG, WebP and AVIF are allowed",
        },
        { status: 400 },
      );
    }

    let parsedTags: string[]|null=null;

    try {
      parsedTags = JSON.parse(String(tags));
      console.log(parsedTags)
        if (!Array.isArray(parsedTags)) {
    throw new Error();
  }
    } catch {
      return NextResponse.json(
        { message: "Invalid tags format" ,parsedTags},
        { status: 400 },
      );
    }

    const validation = createArticleSchema.safeParse({
      title,
      description,
      tags: parsedTags,
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    const {
      title: validTitle,
      description: validDescription,
      tags: validTags,
    } = validation.data;

    const normalizedTags = validTags.map((tag) => tag.toLowerCase());

    const buffer = Buffer.from(await image.arrayBuffer());

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "article-images",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    });

    const article = await prisma.article.create({
      data: {
        title: validTitle,
        description: validDescription,

        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,

        articleTags: {
          create: normalizedTags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: {
                  name: tagName,
                },
                create: {
                  name: tagName,
                },
              },
            },
          })),
        },
      },

      select: {
        id: true,
      },
    });

await createGlobalNotification({
  type: "GLOBAL",
  title: "New article",
  message: `A new article "${validTitle}" has been published`,
  url: `/articles/${article.id}`,
});
    revalidateTag("articles")

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("createArticleError", error);

    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}


/**
 *  @method  Delete
 *  @route   ~/api/articles
 *  @desc    Delete many Articles
 *  @access   private (only admin can delete articles)
 */
export async function DELETE(request: NextRequest) {
  try {

   
    const session = await auth();
    const user = session?.user;

    const allowed = await GlobalRateLimit(request, user);

    if (!allowed) {
      return NextResponse.json(
        { message: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    if (!user ) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 401 }
      );
    }


    if (!user || user?.isAdmin !== true) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

const data=await request.json()

const validation = deleteManyArticlesschema.safeParse({ids:data.ids});

if (!validation.success) {
  return NextResponse.json(
    { message: validation.error?.errors[0].message },
    { status: 400 }
  );
}

const { ids } = validation.data;

   const result = await prisma.$transaction(async (tx) => {
  // Get articles + their Cloudinary public IDs
  const articles = await tx.article.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      title:true,
      imagePublicId: true,
      articleTags:{
          select:{
            tagId:true
          }
      }
    },
  });

  const imagePublicIds = articles
    .map((article) => article.imagePublicId)
    .filter((id): id is string => Boolean(id));



  const tagIds = [...new Set(articles.flatMap((item) => item.articleTags.map(({tagId})=>tagId)))];

  // Delete articles
  const deletedArticles = await tx.article.deleteMany({
    where: {
      id: {
        in: ids,
      },
    
    },
    
  });

  // Delete unused tags
  let deletedTags = 0;

  if (tagIds.length > 0) {
    const result = await tx.tag.deleteMany({
      where: {
        id: {
          in: tagIds,
        },
        articles: {
          none: {},
        },
      },
    });

    deletedTags = result.count;
  }

  return {
    deletedArticles: deletedArticles.count,
    deletedTags,
    imagePublicIds,
    articleTitle: articles[0]?.title,

  };
});

// Delete Cloudinary images AFTER successful transaction
if (result.imagePublicIds.length > 0) {
  await Promise.all(
    result.imagePublicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    )
  );
}

if (ids.length === 1 && result.deletedArticles === 1) {
  await createGlobalNotification({
    type: "GLOBAL",
    title: "Article deleted",
    message: `The article "${result.articleTitle}" has been deleted`,
  });
}
revalidateTag("articles")
if(ids.length===1)revalidateTag(`article-${ids[0]}`)
return NextResponse.json({
  deletedArticles: result.deletedArticles,
  deletedTags: result.deletedTags,
});
  } catch (error) {
    console.error("deleteArticlesError", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}