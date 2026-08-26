"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import React from "react";
import LoadingComments from "./loadingComments";
import ReplyItem from "./ReplyItem";
import { getCommentReplies } from "@/apiCalls/clientCalls/comments";

interface Props {
  rootId: number;
  replyCount: number;
  currentUserId?: number;
}

export default function Replies({ rootId, replyCount, currentUserId }: Props) {
  const [open, setOpen] = React.useState(false);

  const query = useInfiniteQuery({
    queryKey: ["replies", rootId],

    queryFn: ({ pageParam }) => getCommentReplies(rootId, pageParam),

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

    enabled: open,
  });

  const replies = Array.from(
    new Map(
      (query.data?.pages.flatMap((page) => page?.replies ?? []) ?? []).map(
        (reply) => [reply.id, reply],
      ),
    ).values(),
  );
  if (replyCount === 0) {
    return null;
  }

  return (
    <div>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Show {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </button>
      )}

      {open && (
        <div className="mt-4 border-l border-border pl-4">
          {query.isLoading && <LoadingComments count={2} compact />}

          {query.isError && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Failed to load replies.</span>
              <button
                type="button"
                onClick={() => query.refetch()}
                className="font-medium text-primary hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {replies.map((reply) => (
            <div key={reply.id}>
              <ReplyItem
                reply={reply}
                rootId={rootId}
                currentUserId={currentUserId}
              />
            </div>
          ))}

          {query.hasNextPage && (
            <button
              type="button"
              disabled={query.isFetchingNextPage}
              onClick={() => query.fetchNextPage()}
              className="text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              {query.isFetchingNextPage ? "Loading..." : "Show more replies"}
            </button>
          )}

          {!query.hasNextPage && !query.isLoading && replies.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Hide replies
            </button>
          )}
        </div>
      )}
    </div>
  );
}
