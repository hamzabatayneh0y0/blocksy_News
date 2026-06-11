"use client";
import { DOMAIN } from "@/utils/constants";
import { NewArticle } from "@/utils/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaVoteYea } from "react-icons/fa";
import { toast } from "react-toastify";

type ArticleProps = {
  article: NewArticle;
  userId: number | undefined;
};
export default function SingleArticleComponent({
  article,
  userId,
}: ArticleProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isBookmarked = article.bookmarks?.some(
    (bookmark: any) => bookmark.userId === userId,
  );

  async function handleSave() {
    try {
      await axios.post(`${DOMAIN}/api/articles/${article.id}/save`);
      router.refresh();
      toast.success(`Done`);
    } catch (err: any) {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message);
    }
  }

  return (
    <div className="bg-white dark:bg-black p-5 rounded-md border shadow-md">
      <div className="flex flex-col justify-center gap-1 items-end mb-4 relative p-1 ">
        <div
          className="cursor-pointer flex flex-col justify-center gap-1 relative z-2 p-1"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {" "}
          <span className="w-1 h-1 rounded-full bg-gray-400  block"></span>
          <span className="w-1 h-1 rounded-full bg-gray-400  block"></span>
          <span className="w-1 h-1 rounded-full bg-gray-400  block"></span>
        </div>
        {open && (
          <>
            <div
              className="inset-0 fixed "
              onClick={() => {
                setOpen(false);
              }}
            ></div>
            <div
              className={`shadow-md bg-white dark:bg-black dark:shadow-white rounded-md absolute top-full right-0`}
            >
              <p
                onClick={async (e) => {
                  setOpen(false);
                  handleSave();
                }}
                className="capitalize font-light hover:text-primary p-2 cursor-pointer "
              >
                <FaVoteYea
                  className={`${isBookmarked ? "text-primary" : ""} inline me-1`}
                />
                {isBookmarked ? "saved" : "save"}
              </p>
            </div>
          </>
        )}
      </div>
      <h2
        className="font-bold text-2xl lg:text-3xl text-center hover:text-primary duration-300"
        title="read more"
      >
        <Link href={`/articles/${article.id}`}>
          {article.title.toUpperCase()}
        </Link>
      </h2>
      <p className="font-light my-5 lg:text-2xl ">{article.description}</p>
      <span className="font-light block text-right text-sm">
        {new Date(article.createdAt).toLocaleDateString()}
      </span>
    </div>
  );
}
