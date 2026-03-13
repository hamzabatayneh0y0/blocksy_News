"use client";
import { DOMAIN } from "@/utils/constants";
import { SingleArticle } from "@/utils/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { toast } from "react-toastify";

type ArticleProps = {
  article: SingleArticle;
  userId: number | undefined;
};

export default function LikeButton({ article, userId }: ArticleProps) {
  const [like, setLike] = useState(false);
  const router = useRouter();

  const isliked = article.likes?.some((like: any) => like.userId === userId);
  async function handleLike() {
    try {
      await axios.post(`${DOMAIN}/api/articles/${article.id}/like`);
      router.refresh();
    } catch (err: any) {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message);
    }
  }
  return (
    <>
      <AiOutlineLike
        className={` text-2xl sm:text-3xl cursor-pointer duration-300   ${isliked ? "text-primary" : ""}  ${like ? "scale-125 pointer-events-none" : "scale-100"}`}
        onClick={() => {
          handleLike();
          setLike(!like);
          setTimeout(() => setLike(false), 303);
        }}
      />
    </>
  );
}
