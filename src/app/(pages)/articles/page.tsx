import { getArticles } from "@/apiCalls/articles";
import ArticleFilter from "@/components/AllArticlesFilter";
import CategorySearch from "@/components/AllArticlesSearch";
import ArticleComponent from "@/components/Article";
import ArticlePagination from "@/components/Pagination";

import { getArticlesProps } from "@/utils/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
type ArticlesProps = {
  searchParams: Promise<{
    pageNumber?: string;
    searchText?: string;
    sort?: string;
  }>;
};

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Explore all articles on our platform. Read the latest insights, guides, and stories shared by our community.",
  openGraph: {
    title: "All Articles",
    description:
      "Discover the latest articles and trending topics from our platform.",
  },
};

export default async function Articles({ searchParams }: ArticlesProps) {
  const params = await searchParams;

  const searchText = params.searchText ?? "";
  const sort = params.sort ?? "latest";

  const parsedPage = Number(params.pageNumber);

  const pageNumber =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const data = (await getArticles(
    sort,
    searchText,
    pageNumber.toString(),
  )) as getArticlesProps;

  const pages = data?.totalPages;

  if (pages > 0 && pageNumber > pages) {
    notFound();
  }

  return (
    <main className="flex-1 py-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All <span className="text-primary">Articles</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Explore the latest articles and discover interesting topics.
          </p>
        </div>
        {/* Search + Filter */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <CategorySearch initialSearch={searchText} currentSort={sort} />
          <ArticleFilter currentSort={sort} searchText={searchText} />
        </div>
        {/* Results information */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-bold">
            {data.totalArticles}{" "}
            {data.totalArticles === 1 ? "article" : "articles"} found
          </p>

          {(searchText || sort !== "latest") && (
            <a
              href="/articles"
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </a>
          )}
        </div>
        data
        {/* Articles */}
        {data.articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.articles.map((article) => (
              <ArticleComponent key={article.id} {...article} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed">
            <div className="text-center">
              <h2 className="text-lg font-semibold">No articles found</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filter.
              </p>
            </div>
          </div>
        )}
        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-12">
            <ArticlePagination
              currentPage={pageNumber}
              lastIndex={pages}
              searchText={searchText}
              sort={sort}
            />
          </div>
        )}
      </div>
    </main>
  );
}
