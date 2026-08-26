"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, CircleAlert, Trash2 } from "lucide-react";
import { deleteManyArticles } from "@/apiCalls/clientCalls/articles";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MorphingInfinity } from "./morphing-infinity";

interface DeleteArticleDialogProps {
  articleIds: number[];
  setArticleIds?: Dispatch<SetStateAction<number[]>>;
  manyArticles: boolean;
  numberOfArticles: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type DialogState = "confirm" | "success" | "error";

export default function DeleteArticleDialog({
  articleIds,
  setArticleIds,
  manyArticles,
  numberOfArticles,
  open,
  onOpenChange,
  onSuccess,
}: DeleteArticleDialogProps) {
  const [state, setState] = useState<DialogState>("confirm");
  const [error, setError] = useState("");

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteManyArticles(articleIds.map((id) => id.toString())),

    onSuccess: () => {
      router.refresh();
      setArticleIds?.([]);
      setState("success");
      onSuccess?.();
    },

    onError: (error) => {
      setState("error");
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
    },
  });

  function handleOpenChange(value: boolean) {
    if (!value) {
      setState("confirm");
    }

    onOpenChange(value);
  }

  const articleText = numberOfArticles === 1 ? "article" : "articles";

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className={"not-sm:w-[90%]"}>
        {state === "confirm" && (
          <>
            <AlertDialogHeader>
              <div className="mb-2 flex size-12 m-auto items-center justify-center rounded-full bg-destructive/10">
                <CircleAlert className="size-10 text-destructive m-auto" />
              </div>

              <AlertDialogTitle>
                {manyArticles
                  ? `Are you sure you want to delete these ${numberOfArticles} articles?`
                  : "Are you sure you want to delete this article?"}
              </AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone.{" "}
                {manyArticles
                  ? `These ${numberOfArticles} ${articleText} and their associated data will be permanently deleted.`
                  : "The article and its associated data will be permanently deleted."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() => {
                  mutate();
                }}
                disabled={isPending}
                className="cursor-pointer bg-destructive text-white hover:bg-destructive/90 curpo"
              >
                {isPending ? (
                  <>
                    <MorphingInfinity className="size-6" /> Deleting...
                  </>
                ) : manyArticles ? (
                  `Yes, Delete ${numberOfArticles} articles`
                ) : (
                  "Yes, Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {state === "success" && (
          <>
            <AlertDialogHeader>
              <div className="mb-2 flex size-12  m-auto items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-10 text-green-500 " />
              </div>

              <AlertDialogTitle>
                {manyArticles
                  ? `${numberOfArticles} articles deleted successfully`
                  : "Article deleted successfully"}
              </AlertDialogTitle>

              <AlertDialogDescription>
                {manyArticles
                  ? "The selected articles have been permanently deleted."
                  : "The article has been permanently deleted."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={() => {
                  onOpenChange(false);

                  setState("confirm");
                }}
              >
                Done
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {state === "error" && (
          <>
            <AlertDialogHeader>
              <div className="mb-2 flex size-12 m-auto items-center justify-center rounded-full bg-destructive/10">
                <CircleAlert className="size-10 text-destructive " />
              </div>

              <AlertDialogTitle>
                Failed to delete {manyArticles ? "articles" : "article"}
              </AlertDialogTitle>

              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                className="cursor-pointer"
                onClick={() => setState("confirm")}
              >
                Try again
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
