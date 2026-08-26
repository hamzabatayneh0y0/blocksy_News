"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import ProfileComment from "./ProfileComment";
import { getUserActivities } from "@/apiCalls/clientCalls/profile";
import { UserActivityArticle, UserComment } from "@/utils/types";
import ArticleComponent from "./Article";

type ActivityType = "bookmarks" | "articleLikes" | "comments";

interface Props {
  userId: number;
  type: ActivityType;
}

export default function ProfileActivities({ userId, type }: Props) {
  const { ref, inView } = useInView({
    rootMargin: "300px",
    triggerOnce: false,
  });

  const query = useInfiniteQuery({
    queryKey: ["user-activities", userId, type],

    queryFn: ({ pageParam }) => getUserActivities(userId, type, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 10) {
        return undefined;
      }

      return allPages.length + 1;
    },

    staleTime: 60 * 1000,
    gcTime: 60 * 1000,

    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [
    query,
    inView,
    query.hasNextPage,
    query.isFetchingNextPage,
    query.fetchNextPage,
  ]);

  const items = query.data?.pages.flatMap((page) => page ?? []) ?? [];

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        {query.error.message}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-card py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No {type === "articleLikes" ? "liked articles" : type} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {type === "comments"
        ? (items as UserComment[]).map((comment) => (
            <ProfileComment key={comment.id} comment={comment} />
          ))
        : (items as UserActivityArticle[]).map((article) => (
            <ArticleComponent
              key={article.id}
              id={article.id}
              title={article.title}
              description={article.description}
              createdAt={article.createdAt}
              imageUrl={article.imageUrl}
              tags={article.tags}
              likesCount={article.likesCount}
              savedCount={article.savedCount}
            />
          ))}

      {query.hasNextPage && (
        <div ref={ref} className="py-4">
          {query.isFetchingNextPage && (
            <div className="space-y-3">
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
