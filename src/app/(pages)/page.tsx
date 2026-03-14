import { getArticles } from "@/apiCalls/articles";
import Articlecomponent from "@/components/article";
import { NewArticle } from "@/utils/types";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const token = (await cookies()).get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);

  const articles = (await getArticles("1")) as NewArticle[];
  console.log(articles);
  return (
    <div className=" py-12 px-5">
      <h2 className="font-bold text-3xl md:text-4xl mb-12">
        Latest <span className="text-primary">Articles</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
        {articles.map((article) => {
          return (
            <Articlecomponent
              key={article.id}
              article={article}
              userId={payload?.id}
            />
          );
        })}
      </div>
      <button className="bg-primary text-white font-bold rounded-md p-3 capitalize m-auto block mt-12 hover:text-primary hover:bg-white duration-300 cursor-pointer shadow-xl ">
        <Link href={"./articles?pageNumber=1"}>read more</Link>
      </button>
    </div>
  );
}
