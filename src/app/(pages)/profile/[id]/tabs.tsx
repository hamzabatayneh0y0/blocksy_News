"use client";
import { Article, ArticleLike, Bookmark, Comment } from "@prisma/client";

import DeleteButtonComment from "../../admin/comments/deleteButtonComment";
import Link from "next/link";
import { useState } from "react";
import Articlecomponent from "@/components/article";

type usertype = {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
  createdAt: Date;
  comments: Comment[];
  articleLikes: (ArticleLike & { article: Article })[];
  bookmarks: (Bookmark & { article: Article })[];
};

export default function Tabs({
  user,
  theme,
}: {
  user: usertype;
  theme: boolean;
}) {
  const [tab, setTab] = useState("liked");
  function handletab(e: React.MouseEvent<HTMLLIElement>) {
    setTab(
      (e.currentTarget as HTMLLIElement).getAttribute("data-tab") || "comment",
    );
  }
  return (
    <div className=" py-12">
      <ul className="flex gap-2 justify-around items-center flex-wrap my-12">
        <li
          data-tab="liked"
          className={`sm:text-2xl font-bold capitalize ${tab === "liked" ? "text-primary" : ""} duration-300 cursor-pointer`}
          onClick={handletab}
        >
          liked article
        </li>
        <li
          data-tab="saved"
          className={` sm:text-2xl font-bold capitalize  ${tab === "saved" ? "text-primary" : ""} duration-300 cursor-pointer`}
          onClick={handletab}
        >
          saved article
        </li>
        <li
          data-tab="comment"
          className={` sm:text-2xl font-bold capitalize  ${tab === "comment" ? "text-primary" : ""} duration-300 cursor-pointer`}
          onClick={handletab}
        >
          comments
        </li>
      </ul>

      {tab == "comment" && (
        <div className="comments">
          {user.comments.length === 0 ? (
            <div>No Comments</div>
          ) : (
            <table className="w-full border-collapse">
              <tbody>
                {user.comments.map((comment, i) => {
                  return (
                    <tr key={i} className=" ">
                      <td
                        className="font-light border-2 p-1 sm:p-3 text-center duration-300 animate-fadeIn"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {i + 1}
                      </td>
                      <td
                        className="font-bold border-2  p-1 sm:p-3 duration-300 animate-fadeIn"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {comment.text}
                      </td>
                      <td
                        className=" border-2  p-1 sm:p-3 duration-300 animate-fadeIn"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <Link
                          href={`/articles/${comment.articleId}`}
                          className="w-full bg-primary text-white text-center font-bold rounded-md p-1 capitalize m-auto block  hover:text-primary hover:bg-white duration-300 cursor-pointer shadow-xl "
                        >
                          read
                        </Link>
                      </td>

                      <td
                        className=" border-2 p-1 sm:p-3 duration-300 animate-fadeIn"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <DeleteButtonComment id={comment.id} theme={theme} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab == "saved" && (
        <div className="saved">
          {user.bookmarks?.length === 0 ? (
            <div>No Saved Articles</div>
          ) : (
            user.bookmarks?.map((bookmark, i) => {
              const newArticle = {
                ...bookmark.article,
                bookmarks: [{ userId: user?.id }],
              };
              return (
                <div
                  key={bookmark.id}
                  className={`opacity-0 animate-fadeIn `}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Articlecomponent article={newArticle} userId={user?.id} />
                </div>
              );
            })
          )}
        </div>
      )}

      {tab == "liked" && (
        <div className="liked">
          {user.articleLikes?.length === 0 ? (
            <div>No Liked Articles</div>
          ) : (
            user.articleLikes?.map((articleLike, i) => {
              const newArticle = {
                ...articleLike.article,
                bookmarks: [{ userId: user?.id }],
              };
              return (
                <div
                  key={articleLike.id}
                  className={`opacity-0 animate-fadeIn `}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Articlecomponent article={newArticle} userId={user?.id} />
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
