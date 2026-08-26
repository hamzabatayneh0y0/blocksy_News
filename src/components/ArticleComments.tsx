"use client";

import { useEffect } from "react";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import AddComment from "./AddComment";
import LoadingComments from "./loadingComments";
import { getArticleComments } from "@/apiCalls/clientCalls/comments";
import CommentItem from "./Comment";

interface Props {
  articleId: number;
  currentUserId?: number;
}

export default function ArticleComments({ articleId, currentUserId }: Props) {
  const queryClient = useQueryClient();

  const queryKey = ["article-comments", articleId];

  const { ref, inView } = useInView({
    rootMargin: "300px",
    triggerOnce: false,
  });

  const query = useInfiniteQuery({
    queryKey,

    queryFn: ({ pageParam }) => getArticleComments(articleId, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;

      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },

    staleTime: 60 * 1000,
    gcTime: 60 * 1000,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  /*
   * Infinite scroll
   */
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

  const comments = Array.from(
    new Map(
      (query.data?.pages.flatMap((page) => page?.comments ?? []) ?? []).map(
        (comment) => [comment.id, comment],
      ),
    ).values(),
  );
  if (query.isError) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        {query.error.message}
      </p>
    );
  }

  return (
    <section className="space-y-6">
      {currentUserId && <AddComment articleId={articleId} rootId={null} />}
      {query.isLoading && <LoadingComments />}
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          articleId={articleId}
          totalReplies={comment._count.replies}
          currentUserId={currentUserId}
        />
      ))}
      {query.hasNextPage && (
        <div ref={ref}>
          {query.isFetchingNextPage && <LoadingComments count={2} />}
        </div>
      )}
    </section>
  );
}
