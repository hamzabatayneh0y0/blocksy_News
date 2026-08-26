"use client";

import { useEffect, useState } from "react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Comment, CommentsResponse, RepliesResponse } from "@/utils/types";
import { useDebounce } from "@/utils/hooks/useDebounce";
import {
  deleteComment,
  likeComment,
  updateComment,
} from "@/apiCalls/clientCalls/comments";
import { toast } from "react-toastify";
import AddReply from "./AddReply";
import { useParams } from "next/navigation";
import Replies from "./Replies";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Props {
  reply: Comment;
  rootId: number;
  currentUserId?: number;
}

export default function ReplyItem({ reply, rootId, currentUserId }: Props) {
  const queryClient = useQueryClient();
  const params = useParams();

  const articleId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  // Replies of the comment that this reply belongs to
  const queryKey = ["replies", rootId];

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [text, setText] = useState(reply.text);
  const [imageError, setImageError] = useState(false);
  const [requestedLike, setRequestedLike] = useState<boolean | null>(null);
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
        (old: InfiniteData<RepliesResponse>) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: RepliesResponse) => ({
              ...page,
              replies: page.replies.map((item: Comment) =>
                item.id === commentId ? { ...item, text } : item,
              ),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (error: Error, _variables, context) => {
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
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: InfiniteData<RepliesResponse>) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: RepliesResponse) => ({
              ...page,
              replies: page.replies.filter(
                (item: Comment) => item.id !== commentId,
              ),
            })),
          };
        },
      );

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
                        replies: Math.max(0, comment._count.replies - 1),
                      },
                    }
                  : comment,
              ),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(error.message);
    },
  });

  /*
   * Like
   */
  const likeMutation = useMutation({
    mutationFn: (isLiked: boolean) => likeComment(reply.id, isLiked),

    onError: (error: Error) => {
      toast.error(error.message);

      queryClient.invalidateQueries({ queryKey });
    },
  });

  /*
   * Update text
   */
  function handleUpdate() {
    const value = text.trim();

    if (!value) {
      return;
    }

    updateMutation.mutate({
      commentId: reply.id,
      text: value,
    });
  }

  /*
   * Like
   */
  function handleLike() {
    const nextIsLiked = !reply.isLiked;

    queryClient.setQueryData(queryKey, (old: InfiniteData<RepliesResponse>) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page: RepliesResponse) => ({
          ...page,
          replies: page.replies.map((item: Comment) => {
            if (item.id !== reply.id) {
              return item;
            }

            return {
              ...item,
              isLiked: nextIsLiked,
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

  /*
   * Send like after debounce
   */
  useEffect(() => {
    if (debouncedLike === null || !reply || likeMutation.isPending) {
      return;
    }
    likeMutation.mutate(debouncedLike);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLike]);

  return (
    <>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex relative size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {reply.user.image && !imageError ? (
            <Image
              src={
                reply.user.image ??
                "/images/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.avif"
              }
              alt="avatar"
              fill
              className="object-cover object-center"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-xs font-semibold">
              {(reply.user.name?.[0] ?? "U").toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Comment */}
          <div className="rounded-xl bg-muted/50 px-3 py-2">
            <p className="text-xs font-semibold">
              {reply.user.name ?? "Unknown user"}
            </p>

            {reply.parent?.user.name && (
              <p className="text-[11px] text-muted-foreground">
                Reply to {reply.parent.user.name}
              </p>
            )}
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full resize-none rounded-md border bg-background p-2 text-sm outline-none "
                  rows={3}
                />

                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      updateMutation.isPending ||
                      deleteMutation.isPending ||
                      text.trim().length < 1 ||
                      text.trim() === reply.text
                    }
                    onClick={handleUpdate}
                    className={"cursor-pointer"}
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={updateMutation.isPending}
                    className={"cursor-pointer"}
                    onClick={() => {
                      setText(reply.text);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1 whitespace-pre-wrap break-words text-sm">
                {reply.text}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-4 pl-0 flex-wrap">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={
                deleteMutation.isPending || likeMutation.isPending || !reply
              }
              className="relative z-10 h-7 cursor-pointer px-2 text-xs text-muted-foreground disabled:opacity-100"
              onClick={handleLike}
            >
              <Heart
                className={`size-4 ${
                  reply.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }`}
              />
              <span>{reply._count.likes}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={deleteMutation.isPending || !reply}
              className="h-7 cursor-pointer px-2 text-xs text-muted-foreground "
              onClick={() => setIsReplying((prev) => !prev)}
            >
              Reply
            </Button>

            {currentUserId === reply.user.id && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={
                    deleteMutation.isPending ||
                    updateMutation.isPending ||
                    !reply
                  }
                  className="h-7 cursor-pointer px-2 text-xs text-muted-foreground"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={
                    deleteMutation.isPending ||
                    updateMutation.isPending ||
                    !reply
                  }
                  className="h-7 cursor-pointer px-2 text-xs text-destructive hover:text-destructive"
                  onClick={() => deleteMutation.mutate(reply.id)}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>

          {/* Reply input */}
          {isReplying && (
            <div className="mt-3">
              <AddReply
                articleId={articleId}
                parentId={reply.id}
                rootId={rootId}
                parentCacheKey={queryKey}
                onCancel={() => {
                  setIsReplying(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
