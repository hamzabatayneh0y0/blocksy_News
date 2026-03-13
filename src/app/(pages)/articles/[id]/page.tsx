import { getSingleArticles } from "@/apiCalls/articles";
import Articlecomponent from "@/components/article";
import Comment from "@/components/comment";
import type { SingleArticle } from "@/utils/types";
import CommentForm from "./commentForm";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import LikeButton from "./likebutton";

type SingleArticleProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SingleArticleProps) {
  const { id } = await params;

  const article = await getSingleArticles(id);

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

export default async function SingleArticle({ params }: SingleArticleProps) {
  const { id } = await params;
  const token = (await cookies()).get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);
  const article = (await getSingleArticles(id.toString())) as SingleArticle;
  return (
    <div className="py-12 px-5 ">
      <Articlecomponent article={article} userId={payload?.id} />
      <div className="mt-12 flex gap-1 items-center bg-white shadow-md p-5 border rounded-md w-fit  dark:bg-black dark:shadow-white">
        <span className="text-2xl"> {article.likes.length}</span>
        <LikeButton article={article} userId={payload?.id} />
      </div>
      <div className="py-12">
        <CommentForm id={article.id} />
      </div>
      <div className="comments flex flex-col gap-3">
        {article.comments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              comment={comment}
              userId={payload?.id.toString()}
            />
          );
        })}
      </div>
    </div>
  );
}
