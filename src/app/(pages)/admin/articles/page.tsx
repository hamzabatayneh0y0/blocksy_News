import { getArticles, getArticlesCount } from "@/apiCalls/articles";
import { Article } from "@prisma/client";
import ArticlesTable from "./articlesTable";
import AdminAticlesPagination from "@/components/AdminAticlesPagination";

export default async function AdmineArticles({
  searchParams,
}: {
  searchParams: Promise<{ pageNumber: string }>;
}) {
  const { pageNumber } = await searchParams;
  const articles = (await getArticles(pageNumber)) as Article[];

  const { count } = await getArticlesCount();
  const pages = Math.ceil(count / 6);
  const countArray = [];
  for (let i = 0; i < pages; i++) {
    countArray.push(i + 1);
  }

  return (
    <div className="my-12">
      <h1 className="text-3xl font-bold mb-5"> Articles</h1>
      <ArticlesTable articles={articles} />

      <AdminAticlesPagination countArray={countArray} pageNumber={pageNumber} />
    </div>
  );
}
