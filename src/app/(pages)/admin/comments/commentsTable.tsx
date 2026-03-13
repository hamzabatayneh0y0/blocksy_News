import Link from "next/link";
import { Comment } from "@prisma/client";
import DeleteButtonComment from "./deleteButtonComment";

export default async function CommentsTable({
  comments,
}: {
  comments: Comment[];
}) {
  return (
    <>
      <div>
        <table className="w-full">
          <tbody>
            {comments.map((comment, i) => {
              return (
                <tr key={i}>
                  <td className="font-light border-2 p-1 sm:p-3 text-center">
                    {i + 1}
                  </td>
                  <td className="font-bold border-2  p-1 sm:p-3">
                    {comment.text}
                  </td>
                  <td className=" border-2  p-1 sm:p-3">
                    <Link
                      href={`/articles/${comment.articleId}`}
                      className="w-full bg-primary text-white text-center font-bold rounded-md p-1 capitalize m-auto block  hover:text-primary hover:bg-white duration-300 cursor-pointer shadow-xl "
                    >
                      read
                    </Link>
                  </td>
                  <td className=" border-2 p-1 sm:p-3">
                    <DeleteButtonComment id={comment.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
