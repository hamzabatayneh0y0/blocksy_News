import { getArticles, getArticlesCount } from "@/apiCalls/articles";
import Articlecomponent from "@/components/article";
import { redirect } from "next/navigation";
import style from "./articles.module.css";
import Pagination from "./pagination";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { NewArticle } from "@/utils/types";

type ArticlesProps = {
  searchParams: Promise<{ pageNumber: string }>;
};

export const metadata = {
  title: "All Articles",
  description:
    "Explore all articles on our platform. Read the latest insights, guides, and stories shared by our community.",
  openGraph: {
    title: "All Articles",
    description:
      "Discover the latest articles and trending topics from our platform.",
    images: ["/public/next.svg"],
  },
};

export default async function Articles({ searchParams }: ArticlesProps) {
  const token = (await cookies()).get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);

  const { pageNumber } = await searchParams;
  const articles = (await getArticles(pageNumber)) as NewArticle[];
  const { count } = await getArticlesCount();
  const pages = Math.ceil(count / 6);
  const countArray = [];
  for (let i = 0; i < pages; i++) {
    countArray.push(i + 1);
  }

  const handleSearch = async (form: FormData) => {
    "use server";
    const search = form.get("search")?.toString();

    redirect(`/articles/search?searchText=${search}`);
  };
  return (
    <div className=" py-12 px-5">
      <h2 className="font-bold text-3xl md:text-4xl mb-12">
        All <span className="text-primary">Articles</span>
      </h2>
      <form
        action={handleSearch}
        className="my-5 flex gap-2 flex-col sm:flex-row sm:justify-between  "
      >
        <input
          required
          type="search"
          name="search"
          placeholder="search"
          className="p-3 border rounded-md inset-shadow-2xs shadow-black bg-white w-full dark:bg-black dark:inset-shadow-white"
        />
        <button
          type="submit"
          className="bg-primary text-white font-light rounded-md p-2  capitalize block mt-2 w-fit hover:text-primary hover:bg-white duration-300 cursor-pointer shadow-xl "
        >
          search
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
        {articles.map((article, i) => {
          return (
            <div
              key={article.id}
              className={`opacity-0 animate-fadeIn ${style[`delay-${i}`]}`}
            >
              <Articlecomponent article={article} userId={payload?.id} />
            </div>
          );
        })}
      </div>

      <Pagination countArray={countArray} pageNumber={pageNumber} />
    </div>
  );
}
