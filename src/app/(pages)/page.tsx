import { getArticles } from "@/apiCalls/articles";

import Image from "next/image";
import Link from "next/link";

import { Heart } from "lucide-react";

import ArticleComponent from "@/components/Article";
import { Article, getArticlesProps } from "@/utils/types";
import { auth } from "@/auth";
import { getForYouArticles } from "@/apiCalls/profile";
import ForYouSection from "@/components/ForYouSection";

export default async function Home() {
  const session = await auth();
  const [
    { articles: popularArticles = [] },
    { articles: latestArticles = [] },
    forYouArticles = [],
  ] = await Promise.all([
    getArticles("popular", "", "1") as Promise<getArticlesProps>,
    getArticles("latest", "", "1") as Promise<getArticlesProps>,
    session?.user?.id
      ? getForYouArticles(session.user.id)
      : Promise.resolve([]),
  ]);
  return (
    <main className="flex-1">
      {/* ================= HERO ================= */}
      <section className="px-5 pb-14 pt-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Hero heading */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Trending now
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              What people are <span className="text-primary">reading</span>
            </h1>

            <p className="mt-4 max-w-2xl text-muted-foreground">
              Discover the articles getting the most attention from our
              community.
            </p>
          </div>

          {/* Popular articles */}
          {popularArticles?.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Main article */}
              <Link
                href={`/articles/${popularArticles[0].id}`}
                className="group relative min-h-[420px] overflow-hidden rounded-3xl bg-muted"
              >
                <Image
                  src={popularArticles[0].imageUrl}
                  alt={popularArticles[0].title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      #1 Trending
                    </span>

                    <span className="flex items-center gap-1 text-xs text-white/80">
                      <Heart className="size-3.5" fill="currentColor" />

                      {popularArticles[0].likesCount}
                    </span>
                  </div>

                  <h2 className="line-clamp-3 text-2xl font-bold text-white sm:text-3xl">
                    {popularArticles[0].title}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">
                    {popularArticles[0].description}
                  </p>
                </div>
              </Link>

              {/* Side articles */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {popularArticles.slice(1, 3).map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="group relative min-h-[200px] overflow-hidden rounded-3xl bg-muted"
                  >
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">
                          #{index + 2} Trending
                        </span>

                        <span className="flex items-center gap-1 text-xs text-white/70">
                          <Heart className="size-3" fill="currentColor" />

                          {article.likesCount}
                        </span>
                      </div>

                      <h3 className="line-clamp-2 text-lg font-semibold text-white">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= LATEST ================= */}
      <section className="border-t px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
                Fresh from the community
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Latest <span className="text-primary">Articles</span>
              </h2>
            </div>

            <Link
              href="/articles"
              className="hidden text-sm font-medium text-primary hover:underline sm:block"
            >
              View all →
            </Link>
          </div>

          {latestArticles?.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleComponent key={article.id} {...article} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed">
              <div className="text-center">
                <h2 className="text-lg font-semibold">No articles yet</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  There are no articles to display.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link
              href="/articles"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl"
            >
              Explore all articles
            </Link>
          </div>
        </div>
      </section>
      <ForYouSection
        articles={
          forYouArticles.length === 0
            ? latestArticles.slice(0, 3)
            : forYouArticles
        }
      />
    </main>
  );
}
