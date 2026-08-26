import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Article } from "@/utils/types";

/**
 *  @method  GET
 *  @route   ~/api/articles/search?sort=value&searchText=value&pageNumber=num
 *  @desc    Get Articles By Search Text
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
  const searchText = request.nextUrl.searchParams.get("searchText")||"";
  const pageNumber = request.nextUrl.searchParams.get("pageNumber")||"1";
  const sort = request.nextUrl.searchParams.get("sort") || "latest";

  // if (!searchText) {
  //   return NextResponse.json(
  //     { message: "You have to write something" },
  //     { status: 400 }
  //   );
  // }


  // if (!isNaN(parseInt(searchText))) {
  //   return NextResponse.json(
  //     { message: "Invalid searchText" },
  //     { status: 400 }
  //   );
  // }

  const page = Math.max(parseInt(pageNumber||"") || 1, 1);
 
  
  // Validate sort
    const allowedSorts = ["latest", "oldest", "popular"] as const;

    if (!allowedSorts.includes(sort.toLowerCase() as ((typeof allowedSorts)[number]))) {
      return NextResponse.json(
        {
          message:
            "Invalid sort. Allowed values are latest, oldest and popular",
        },
        { status: 400 },
      );
    }

 const orderBy =
  sort === "latest"
    ? [{ createdAt: "desc" as const }]
    : sort === "oldest"
      ? [{ createdAt: "asc" as const }]
      : [
          { likes: { _count: "desc" as const } },
          { createdAt: "desc" as const },
        ];

const [articles, totalArticles] = await Promise.all([
  prisma.article.findMany({
    where :{
  articleTags: {
    some: {
      tag: {
        name: {
          contains: searchText.toLowerCase()||"",
          mode: "insensitive",
        },
      },
    },
  },
},
    skip: (page - 1) * ARTICLE_PER_PAGE,
    take: ARTICLE_PER_PAGE,
   orderBy,
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
  }),

  prisma.article.count({
    where :{
  articleTags: {
    some: {
      tag: {
        name: {
          contains: searchText.toLowerCase(),
          mode: "insensitive",
        },
      },
    },
  },
},
  }),
]);
  const result = articles.map(({ articleTags, _count, ...article }) => ({
    ...article,
    tags: articleTags.map(({ tag }) => tag.name),
    likesCount: _count.likes,
      savedCount: _count.bookmarks,
  }));

  return NextResponse.json(
    {
      articles: result as Article[],
      currentPage: page,
      totalPages: Math.ceil(totalArticles / ARTICLE_PER_PAGE),
      totalArticles,
      sort
    },
    { status: 200 }
  );
} catch (error) {
  console.error("searchArticles", error);

  return NextResponse.json(
    { message: "Something went wrong" },
    { status: 500 }
  );
}
}
