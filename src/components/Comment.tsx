"use client";

import { useEffect, useState } from "react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Comment, CommentsResponse } from "@/utils/types";
import Replies from "./Replies";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import AddReply from "./AddReply";
import {
  deleteComment,
  likeComment,
  updateComment,
} from "@/apiCalls/clientCalls/comments";
import { useSession } from "next-auth/react";

interface Props {
  comment: Comment;
  currentUserId?: number;
  totalReplies: number;
  articleId: number;
}

export default function CommentItem({
  comment,
  currentUserId,
  totalReplies,
  articleId,
}: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["article-comments", articleId];

  const [isEditing, setIsEditing] = useState(false);

  const [text, setText] = useState(comment.text);
  const [requestedLike, setRequestedLike] = useState<boolean | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const { data: Session } = useSession();
  const debouncedLike = useDebounce(requestedLike, 500);

  /*
   * Update
   */
  const updateMutation = useMutation({
    mutationFn: ({ commentId, text }: { commentId: number; text: string }) =>
      updateComment(commentId, text),

    onMutate: async ({ commentId, text }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      setIsEditing(false);

      queryClient.setQueryData(
        queryKey,
        (old: InfiniteData<CommentsResponse>) => {
          if (!old) {
            return old;
          }

          return {
            ...old,

            pages: old.pages.map((page: CommentsResponse) => ({
              ...page,

              comments: page.comments.map((item: Comment) =>
                item.id === commentId
                  ? {
                      ...item,
                      text,
                    }
                  : item,
              ),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(error.message);
      setIsEditing(false);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-activities", Session?.user.id, "comments"],
      });
    },
  });

  /*
   * Delete
   */
  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-activities", Session?.user.id, "comments"],
      });
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey,
      });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) {
          return old;
        }

        return {
          ...old,

          pages: old.pages.map((page: any) => ({
            ...page,

            comments: page.comments.filter(
              (item: any) => item.id !== commentId,
            ),

            totalComments: Math.max(page.totalComments - 1, 0),
          })),
        };
      });

      return { previousData };
    },

    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(error.message);
    },
  });

  const likeMutation = useMutation({
    mutationFn: (isLiked: boolean) => likeComment(comment.id, isLiked),

    onError: (error) => {
      toast.error(error.message);

      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  function handleUpdate() {
    const value = text.trim();

    if (!value) {
      return;
    }

    updateMutation.mutate({
      commentId: comment.id,
      text: value,
    });
  }

  function handleLike() {
    const currentIsLiked = comment?.isLiked;

    const nextIsLiked = !currentIsLiked;

    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          comments: page.comments.map((item: Comment) => {
            if (item.id !== comment.id) {
              return item;
            }

            return {
              ...item,
              isLiked: !item.isLiked,
              _count: {
                ...item._count,
                likes: Math.max(item._count.likes + (nextIsLiked ? 1 : -1), 0),
              },
            };
          }),
        })),
      };
    });
    setRequestedLike(nextIsLiked);
  }

  useEffect(() => {
    if (debouncedLike === null || likeMutation.isPending || !comment) {
      return;
    }

    likeMutation.mutate(debouncedLike);
  }, [debouncedLike]);

  return (
    <>
      <article className="space-y-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
              <Image
                src={
                  comment.user.image ??
                  "/images/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.avif"
                }
                alt="User avatar"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {comment.user.name ?? "User"}
              </p>

              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                    className="w-full resize-none rounded-md border border-input bg-background p-2 text-sm"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      disabled={
                        updateMutation.isPending ||
                        deleteMutation.isPending ||
                        text.trim().length < 1 ||
                        text.trim() === comment.text
                      }
                      className="rounded-md bg-primary cursor-pointer px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
                    >
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      disabled={updateMutation.isPending}
                      onClick={() => {
                        setText(comment.text);
                        setIsEditing(false);
                      }}
                      className="rounded-md bg-muted px-3 py-1.5 text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                  {comment.text}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 pl-12 flex-wrap">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={
                deleteMutation.isPending || likeMutation.isPending || !comment
              }
              className="relative z-10 h-7 px-2 text-xs text-muted-foreground cursor-pointer disabled:opacity-100"
              onClick={handleLike}
            >
              <Heart
                className={`size-4 ${
                  comment.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }`}
              />

              <span>{comment._count.likes}</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={deleteMutation.isPending}
                className="h-7 px-2 text-xs text-muted-foreground cursor-pointer"
                onClick={() => setIsReplying((prev) => !prev)}
              >
                Reply
              </Button>

              {currentUserId === comment.user.id && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={
                      deleteMutation.isPending || updateMutation.isPending
                    }
                    className="h-7 px-2 text-xs text-muted-foreground cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={
                      deleteMutation.isPending || updateMutation.isPending
                    }
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive cursor-pointer"
                    onClick={() => deleteMutation.mutate(comment.id)}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        {isReplying && currentUserId && (
          <AddReply
            articleId={articleId}
            parentId={comment.id}
            rootId={comment.id}
            parentCacheKey={["replies", comment.id]}
            onCancel={() => setIsReplying(false)}
          />
        )}
        <Replies
          rootId={comment.id}
          replyCount={totalReplies}
          currentUserId={currentUserId}
        />
      </article>
    </>
  );
}
