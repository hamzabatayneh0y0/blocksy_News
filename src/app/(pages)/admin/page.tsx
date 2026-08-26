import { getArticles } from "@/apiCalls/articles";
import AdminContent from "@/components/AdminContent";
import CategorySearch from "@/components/Adminsearch";
import { getArticlesProps } from "@/utils/types";

export default async function Admine({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    searchText?: string;
    pageNumber?: string;
  }>;
}) {
  const params = await searchParams;

  const sortt = params.sort || "latest";
  const searchText = params.searchText || "";
  const page = params.pageNumber || "1";

  const { articles, totalArticles, totalPages, currentPage, sort } =
    (await getArticles(
      sortt,
      searchText,
      Number(page) > 0 ? page : "1",
    )) as getArticlesProps;
  return (
    <div className="flex flex-col items-center">
      <CategorySearch />
      <AdminContent
        articles={articles || []}
        totalArticles={totalArticles}
        totalPages={totalPages}
        currentPage={currentPage}
        sort={sort}
        searchText={searchText}
      />
    </div>
  );
}
