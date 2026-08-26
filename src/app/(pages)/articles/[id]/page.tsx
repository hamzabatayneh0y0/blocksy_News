import { getSingleArticle } from "@/apiCalls/articles";
import { auth } from "@/auth";
import AdminInterAtions from "@/components/AdminInterActions";
import ArticleComments from "@/components/ArticleComments";
import ArticleInteractions from "@/components/ArticleInteractions";
import Recommendations from "@/components/recommendationsResult";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SingleArticlePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const data = await getSingleArticle(id);

  if (!data) {
    notFound();
  }

  const { articleResult, recommendationsResult } = data;

  return (
    <main className="mx-auto w-full  py-12">
      {/* Article */}
      <section className="rounded-xl bg-card p-4 sm:p-6">
        <article>
          <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl">
            <Image
              src={articleResult.imageUrl}
              alt={articleResult.title}
              fill
              priority
              quality={80}
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {articleResult.title}
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              {new Date(articleResult.createdAt).toLocaleDateString()}
            </p>

            <p className="mt-6 leading-8 text-muted-foreground">
              {articleResult.description}
            </p>
          </div>

          <ArticleInteractions articleId={articleResult.id} />

          {session?.user.isAdmin && (
            <AdminInterAtions article={articleResult} />
          )}
        </article>
      </section>

      {/* Comments */}
      <section className="mt-8">
        <ArticleComments
          articleId={Number(id)}
          currentUserId={Number(session?.user.id)}
        />
      </section>

      {/* Recommendations */}
      <section className="mt-8">
        <Recommendations recommendations={recommendationsResult} />
      </section>
    </main>
  );
}
