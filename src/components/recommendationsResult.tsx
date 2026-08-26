import Image from "next/image";
import Link from "next/link";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  tags: string[];
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          Recommended for you
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Articles you might be interested in
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {recommendations.map((article) => (
          <article
            key={article.id}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <Link href={`/articles/${article.id}`}>
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/articles/${article.id}`}>
                <h3 className="line-clamp-2 text-lg font-semibold tracking-tight hover:text-primary">
                  {article.title}
                </h3>
              </Link>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {article.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
