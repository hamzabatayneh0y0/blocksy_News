import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="rounded-xl bg-card py-12 mx-auto w-full">
      <article>
        <Skeleton className="aspect-[16/8] w-full rounded-2xl" />

        <div className="mt-6">
          <Skeleton className="h-10 w-3/4 sm:h-11" />

          <Skeleton className="mt-3 h-4 w-32" />

          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </article>
    </section>
  );
}
