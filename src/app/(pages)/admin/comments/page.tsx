import { Comment } from "@prisma/client";
import CommentsTable from "./commentsTable";
import { getComments } from "@/apiCalls/comments";

export default async function AdmineComments() {
  const comments = (await getComments()) as Comment[];

  return (
    <div className="my-12">
      <h1 className="text-3xl font-bold mb-5"> Comments</h1>
      <CommentsTable comments={comments} />
    </div>
  );
}
