"use client";

import { useState } from "react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Comment, CommentsResponse, CreateCommentPayload } from "@/utils/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import userAvatar from "../../public/images/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.avif";
import { createComment } from "@/apiCalls/clientCalls/comments";

interface Props {
  articleId: number;
  rootId: number | null;
}

const MAX_LENGTH = 500;

export default function AddComment({ articleId, rootId }: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const queryKey = ["article-comments", articleId];
  const [text, setText] = useState("");

  const trimmedText = text.trim();
  const isValid = trimmedText.length > 0 && trimmedText.length <= MAX_LENGTH;

  const mutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      createComment(payload.text, payload.articleId, payload.parentId, rootId),

    onSuccess: (newComment) => {
      queryClient.setQueryData(
        queryKey,
        (oldData: InfiniteData<CommentsResponse>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index !== 0) return page;

              return {
                ...page,
                comments: [newComment, ...page.comments],
                totalComments: page.totalComments + 1,
              };
            }),
          };
        },
      );

      // queryClient.invalidateQueries({
      //   queryKey,
      // });
    },

    onError: (error, _payload, context) => {
      toast.error(error.message);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey });
      setText("");
      queryClient.invalidateQueries({
        queryKey: ["user-activities", session?.user.id, "comments"],
      });
    },
  });

  function handleSubmit() {
    if (!isValid || mutation.isPending) return;

    mutation.mutate({
      text: trimmedText,
      articleId,
      parentId: null,
    });
  }

  return (
    <div className="flex gap-3">
      <div className="relative hidden size-9 shrink-0 overflow-hidden rounded-full bg-muted sm:block">
        <Image
          src={session?.user?.image || userAvatar}
          alt={session?.user?.name ?? "User"}
          fill
          sizes="100px"
          className="size-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Write a comment..."
          aria-label="Write a comment"
          className="min-h-20 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring sm:min-h-24 sm:p-4"
        />

        <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length}/{MAX_LENGTH}
          </span>

          <Button
            disabled={!isValid || mutation.isPending}
            className="w-full cursor-pointer sm:w-auto"
            onClick={handleSubmit}
          >
            {mutation.isPending ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
