import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-1 px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        </div>

        {/* Search + Filter */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-11 w-full max-w-sm rounded-xl" />

          <Skeleton className="h-10 w-full sm:w-[150px]" />
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full overflow-hidden rounded-xl bg-card">
              <div className="flex flex-col gap-5">
                {/* Image */}
                <Skeleton className="aspect-video w-full rounded-lg" />

                {/* Content */}
                <div className="flex flex-col">
                  <Skeleton className="mb-3 h-3 w-24" />

                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="mt-2 h-6 w-3/5" />

                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-11/12" />
                  <Skeleton className="mt-2 h-4 w-3/4" />

                  {/* Tags */}
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-7 w-16 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-14 rounded-full" />
                  </div>

                  {/* Interaction */}
                  <div className="mt-5 flex items-center gap-4 border-t pt-4">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="ml-auto h-8 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </main>
  );
}
