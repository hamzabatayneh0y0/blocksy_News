import Link from "next/link";
// import Image from "next/image";
import ArticleComponent from "@/components/Article";
import { Article } from "@/utils/types";

type ForYouSectionProps = {
  articles: Article[];
};

export default function ForYouSection({ articles }: ForYouSectionProps) {
  if (!articles.length) {
    return null;
  }
  return (
    <section className="border-t px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
              Picked for you
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              For <span className="text-primary">You</span>
            </h2>
          </div>

          <Link
            href="/articles"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleComponent key={article.id} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}
