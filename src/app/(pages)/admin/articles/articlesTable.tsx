import { Article } from "@prisma/client";
import Link from "next/link";
import DeleteButton from "./deleteBottun";
import UpdateButton from "./updateButton";
import getTheme from "@/utils/getTheme";

export default async function ArticlesTable({
  articles,
}: {
  articles: Article[];
}) {
  const theme = await getTheme();
  return (
    <>
      <div>
        <table className="w-full">
          <tbody>
            {articles.map((article, i) => {
              return (
                <tr key={i}>
                  <td className="font-light border-2 p-1 sm:p-3 text-center">
                    {i + 1}
                  </td>
                  <td title="read" className="font-bold border-2  p-1 sm:p-3">
                    <Link
                      href={`/articles/${article.id}`}
                      className="capitalize m-auto block  hover:text-primary duration-300 cursor-pointer  "
                    >
                      {article.title}
                    </Link>
                  </td>

                  <td className=" border-2  p-1 sm:p-3">
                    <DeleteButton id={article.id} theme={theme} />
                  </td>
                  <td className=" border-2  p-1 sm:p-3">
                    <UpdateButton
                      id={article.id}
                      title={article.title}
                      description={article.description}
                      theme={theme}
                    />
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
