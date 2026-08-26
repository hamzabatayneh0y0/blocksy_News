// import {
//   recommendationsArticlesSchema,
//   updateArticleTagsSchema,
// } from "@/utils/validationSchemas";
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { GlobalRateLimit } from "@/utils/globalratelimite";
// import { auth } from "@/auth";

// interface Props {
//   params: Promise<{ id: string }>;
// }

// /**
//  *  @method  Get
//  *  @route   ~/api/articles/:id/recommendations
//  *  @desc    get similar articles by tags
//  *  @access  public
//  */

// export async function GET(req: NextRequest, { params }: Props) {
//   try {
//     const articleId = parseInt((await params).id);

//     if (isNaN(articleId)) {
//       return NextResponse.json(
//         { message: "Invalid article ID" },
//         { status: 400 },
//       );
//     }

//     const tags = req.nextUrl.searchParams.get("tags")?.split(",") ?? [];
//     const validation = recommendationsArticlesSchema.safeParse({
//       tagsParams: tags,
//     });

//     if (!validation.success) {
//       return NextResponse.json(
//         { message: validation.error.errors[0].message },
//         { status: 400 },
//       );
//     }

//     const { tagsParams } = validation.data;

//     const recommendations = await prisma.article.findMany({
//       where: {
//         id: {
//           not: articleId,
//         },
//         articleTags: {
//           some: {
//             tag: {
//               name: {
//                 in: tagsParams,
//               },
//             },
//           },
//         },
//       },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         createdAt: true,
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
//       take: 3,
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const result = recommendations.map(({ articleTags, ...article }) => ({
//       ...article,
//       tags: articleTags.map(({ tag }) => tag.name),
//     }));

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error("getRecommendations:", error);

//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }
