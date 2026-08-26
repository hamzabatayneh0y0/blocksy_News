"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Comment,
  CommentsResponse,
  CreateCommentPayload,
  RepliesResponse,
} from "@/utils/types";
import { createComment } from "@/apiCalls/clientCalls/comments";
import { useSession } from "next-auth/react";

interface Props {
  articleId: number;
  parentId: number | null;
  rootId: number | null;
  parentCacheKey: unknown[];
  onCancel?: () => void;
}

export default function AddReply({
  articleId,
  parentId,
  rootId,
  parentCacheKey,
  onCancel,
}: Props) {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const mutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      createComment(payload.text, payload.articleId, payload.parentId, rootId),

    onSuccess: (newComment) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["replies", parentId],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: parentCacheKey,
      // });

      queryClient.setQueryData(
        ["article-comments", articleId],
        (oldData: InfiniteData<CommentsResponse>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              comments: page.comments.map((comment) =>
                comment.id === rootId
                  ? {
                      ...comment,
                      _count: {
                        ...comment._count,
                        replies: comment._count.replies + 1,
                      },
                    }
                  : comment,
              ),
            })),
          };
        },
      );
      queryClient.setQueryData(
        parentCacheKey,
        (oldData: InfiniteData<RepliesResponse>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              replies: page.replies.map((reply) =>
                reply.id === parentId
                  ? {
                      ...reply,
                      _count: {
                        ...reply._count,
                        replies: reply._count.replies + 1,
                      },
                    }
                  : reply,
              ),
            })),
          };
        },
      );
      setText("");

      queryClient.setQueryData(
        parentCacheKey,
        (oldData: InfiniteData<RepliesResponse>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              const parentExists = page.replies.some(
                (reply) => reply.id === parentId,
              );
              if (parentExists) {
                return {
                  ...page,
                  replies: [...page.replies, newComment],
                };
              }

              if (index === 0 && !parentExists) {
                return {
                  ...page,
                  replies: [...page.replies, newComment],
                };
              }

              return page;
            }),
          };
        },
      );

      // queryClient.invalidateQueries({ queryKey: parentCacheKey });
      queryClient.invalidateQueries({
        queryKey: ["user-activities", session?.user.id, "comments"],
      });
      onCancel?.();
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit() {
    const value = text.trim();

    if (value.length < 1 || value.length > 500) {
      return;
    }

    mutation.mutate({
      text: value,
      articleId,
      parentId: parentId ?? null,
    });
  }

  return (
    <div className="mt-3 ml-12 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        placeholder="Write a reply..."
        disabled={mutation.isPending}
        className="min-h-20 w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={mutation.isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={mutation.isPending || text.trim().length < 1}
        >
          {mutation.isPending ? "Replying..." : "Reply"}
        </Button>
      </div>
    </div>
  );
}
