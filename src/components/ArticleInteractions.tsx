"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { useDebounce } from "@/utils/hooks/useDebounce";
import {
  getInteractions,
  setLike,
  setSave,
} from "@/apiCalls/clientCalls/articles";
import { toast } from "react-toastify";
import { ArticleInteractionsProps, InteractionsResponse } from "@/utils/types";
import { useSession } from "next-auth/react";

export default function ArticleInteractions({
  articleId,
}: ArticleInteractionsProps) {
  const queryClient = useQueryClient();
  const { data: Session } = useSession();

  const queryKey = ["article-interactions", articleId];

  const [error, setError] = useState("");

  const { data: interactions, isLoading } = useQuery({
    queryKey,
    queryFn: () => getInteractions(articleId),

    staleTime: 60 * 1000,
    gcTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!articleId,
  });

  /*
   * هذه states تمثل الحالة التي يريدها المستخدم.
   * تتغير مباشرة عند الضغط.
   */
  const [requestedLike, setRequestedLike] = useState<boolean | null>(null);
  const [requestedSave, setRequestedSave] = useState<boolean | null>(null);

  /*
   * نعمل debounce للحالة المطلوبة.
   */
  const debouncedLike = useDebounce(requestedLike, 500);
  const debouncedSave = useDebounce(requestedSave, 500);

  /*
   * Like mutation
   */
  const likeMutation = useMutation({
    mutationFn: (isLiked: boolean) => setLike(articleId, isLiked),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-activities", Session?.user.id, "articleLikes"],
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return;
      }

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }

      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  /*
   * Save mutation
   */
  const saveMutation = useMutation({
    mutationFn: (isBookmarked: boolean) => setSave(articleId, isBookmarked),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-activities", Session?.user.id, "bookmarks"],
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return;
      }

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }

      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  /*
   * إرسال Like بعد انتهاء الـ debounce
   */
  useEffect(() => {
    if (debouncedLike === null || !interactions || likeMutation.isPending) {
      return;
    }

    likeMutation.mutate(debouncedLike);
  }, [debouncedLike]);

  /*
   * إرسال Save بعد انتهاء الـ debounce
   */
  useEffect(() => {
    if (debouncedSave === null || !interactions || saveMutation.isPending) {
      return;
    }

    saveMutation.mutate(debouncedSave);
  }, [debouncedSave]);

  function handleLike() {
    if (!interactions) return;

    setError("");

    /*
     * Optimistic update
     */
    queryClient.setQueryData<InteractionsResponse>(queryKey, (old) => {
      if (!old) return old;

      const currentLike = old.isLiked;

      const nextLike = !currentLike;
      setRequestedLike(nextLike);

      return {
        ...old,
        isLiked: nextLike,
        likesCount: nextLike
          ? old.likesCount + 1
          : Math.max(old.likesCount - 1, 0),
      };
    });
  }

  function handleSave() {
    if (!interactions) return;

    setError("");

    /*
     * Optimistic update
     */
    queryClient.setQueryData<InteractionsResponse>(queryKey, (old) => {
      if (!old) return old;

      const currentSave = old.isBookmarked;

      const nextSave = !currentSave;
      setRequestedSave(nextSave);

      return {
        ...old,
        isBookmarked: nextSave,
        savedCount: nextSave
          ? old.savedCount + 1
          : Math.max(old.savedCount - 1, 0),
      };
    });
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/articles/${articleId}`,
      );
    } catch {
      setError("Failed to copy article link");
    }
  }

  if (isLoading || !interactions) {
    return (
      <div className="mt-6 flex items-center gap-6">
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  /*
   * إذا عندنا pending request، نمنع الضغط.
   *
   * أثناء الـ debounce يظل الزر قابلًا للضغط.
   */
  const likeDisabled = likeMutation.isPending;
  const saveDisabled = saveMutation.isPending;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-5">
        {/* Like */}
        <button
          type="button"
          disabled={likeDisabled}
          onClick={handleLike}
          className="flex cursor-pointer items-center gap-2 text-sm transition  "
          aria-label={interactions.isLiked ? "Unlike article" : "Like article"}
        >
          <Heart
            className={`size-5 ${
              interactions.isLiked
                ? "fill-red-500 text-red-500 "
                : "text-muted-foreground"
            }`}
          />

          <span>{interactions.likesCount}</span>
        </button>

        {/* Save */}
        <button
          type="button"
          disabled={saveDisabled}
          onClick={handleSave}
          className="flex cursor-pointer items-center gap-2 text-sm transition"
          aria-label={
            interactions.isBookmarked ? "Remove bookmark" : "Save article"
          }
        >
          <Bookmark
            className={`size-5 ${
              interactions.isBookmarked
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />

          <span>{interactions.savedCount}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex cursor-pointer items-center text-muted-foreground transition hover:text-foreground"
          aria-label="Share article"
        >
          <Share2 className="size-5" />
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
