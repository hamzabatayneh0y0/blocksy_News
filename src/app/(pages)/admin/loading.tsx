import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full">
      {/* Search */}
      <div className="relative w-full max-w-sm py-12">
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      {/* Toolbar */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4">
        {/* Filter */}
        <Skeleton className="h-10 w-[150px] rounded-md" />

        {/* Selection */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border bg-card"
          >
            {/* Image */}
            <Skeleton className="h-48 w-full rounded-none" />

            <div className="space-y-4 p-4">
              {/* Title */}
              <Skeleton className="h-6 w-4/5" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-12 max-w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
