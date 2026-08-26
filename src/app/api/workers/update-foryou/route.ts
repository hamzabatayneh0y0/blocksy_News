import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import  prisma  from "@/lib/db";
import { ForYouTag, UpdateForYouBody } from "@/utils/types";
import { updateForYouTags } from "@/utils/applyDecay";



async function handler(req: Request) {

  console.log("worker")
  const { userId, articleTags } =
    (await req.json()) as UpdateForYouBody;
const id = parseInt(userId);

if (Number.isNaN(id)) {
  return Response.json({
    success: false,
  });
}
  const user = await prisma.user.findUnique({
    where: { id  },
    select: {
      forYou: true,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const currentTags =
    (user.forYou as ForYouTag[]) ?? [];

  const updatedTags = updateForYouTags(
    currentTags,
    articleTags
  );

  await prisma.user.update({
    where: { id },
    data: {
      forYou: updatedTags,
    },
  });

  return Response.json({
    success: true,
  });
}

export const POST = verifySignatureAppRouter(handler);