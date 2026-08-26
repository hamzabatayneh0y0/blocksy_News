interface Props {
  count?: number;
  compact?: boolean;
}

export default function LoadingComments({ count = 3, compact = false }: Props) {
  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`flex gap-3 ${compact ? "" : "animate-pulse"}`}
        >
          <div
            className={`shrink-0 rounded-full bg-muted ${
              compact ? "size-8" : "size-10"
            }`}
          />

          <div className="min-w-0 flex-1 space-y-3">
            <div className="rounded-2xl bg-muted/60 p-4">
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />

              <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-muted" />

              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
              </div>
            </div>

            {!compact && (
              <div className="flex gap-4 px-2">
                <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
