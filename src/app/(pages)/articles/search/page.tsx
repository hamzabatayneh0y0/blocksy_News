import Articlecomponent from "@/components/article";
import { redirect } from "next/navigation";
import { getArticlesBySearch } from "@/apiCalls/articles";
import style from "../articles.module.css";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { NewArticle } from "@/utils/types";

type SearchProp = {
  searchParams: Promise<{ searchText: string }>;
};

export const metadata = {
  title: "Search Articles ",
  description:
    "Search and explore articles by keywords, topics, or categories.",
  openGraph: {
    title: "Search Articles ",
    description:
      "Find articles quickly using the search feature on our platform.",
    images: ["/public/next.svg"],
  },
};

export default async function Search({ searchParams }: SearchProp) {
  const token = (await cookies()).get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);

  const { searchText } = await searchParams;
  const articles = (await getArticlesBySearch(searchText)) as NewArticle[];

  const handleSearch = async (form: FormData) => {
    "use server";
    const search = form.get("search")?.toString();

    redirect(`/articles/search?searchText=${search}`);
  };
  if (!articles.length)
    return (
      <div className="py-12 px-5">
        <form
          action={handleSearch}
          className="my-5 flex gap-2 flex-col sm:flex-row sm:justify-between"
        >
          <input
            required
            type="search"
            name="search"
            placeholder="search"
            className="p-3 border rounded-md inset-shadow-2xs shadow-black bg-white w-full dark:bg-black dark:shadow-white"
          />
          <button
            type="submit"
            className="bg-primary text-white font-light rounded-md p-2 capitalize block mt-2 w-fit hover:text-primary hover:bg-white duration-300 cursor-pointer shadow-xl "
          >
            search
          </button>
        </form>
        <h2 className="font-bold text-3xl md:text-4xl mb-12">
          No Articles Found With{" "}
          <span className="text-primary underline">{searchText}</span> Topic
        </h2>
      </div>
    );
  return (
    <div className=" py-12 px-5">
      <form
        action={handleSearch}
        className="my-5 flex gap-2 flex-col sm:flex-row sm:justify-between"
      >
        <input
          required
          type="search"
          name="search"
          placeholder="search"
          className="p-3 border rounded-md inset-shadow-2xs shadow-black bg-white w-full dark:bg-black dark:shadow-white"
        />
        <button
          type="submit"
          className="bg-primary text-white font-light rounded-md p-2 capitalize block mt-2 w-fit hover:text-primary hover:bg-white duration-300 cursor-pointer shadow-xl "
        >
          search
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
        {articles.map((article, i) => {
          return (
            <div
              key={article.id}
              className={`opacity-0   animate-fadeIn ${style[`delay-${i}`]}`}
            >
              <Articlecomponent article={article} userId={payload?.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
