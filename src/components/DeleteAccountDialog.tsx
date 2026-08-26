"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { CheckCircle2, CircleAlert } from "lucide-react";

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

import { deleteProfile } from "@/apiCalls/clientCalls/profile";
import { useRouter } from "next/navigation";
import { LogOutAction } from "@/actions/logOutAction";

interface Props {
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type State = "confirm" | "success" | "error";

export default function DeleteAccountDialog({
  userId,
  open,
  onOpenChange,
}: Props) {
  const [state, setState] = useState<State>("confirm");
  const [error, setError] = useState("");
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => deleteProfile(userId),

    onSuccess: () => {
      setState("success");
      LogOutAction();
      router.refresh();
    },

    onError: (error: any) => {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );

      setState("error");
    },
  });

  function handleOpenChange(value: boolean) {
    if (!value) {
      setState("confirm");
      setError("");
    }

    onOpenChange(value);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        {state === "confirm" && (
          <>
            <AlertDialogHeader>
              <div className="m-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <CircleAlert className="size-10 text-destructive" />
              </div>

              <AlertDialogTitle>Delete your account?</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. Your account and its associated
                data will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={mutation.isPending}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={mutation.isPending}
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={(e) => {
                  e.preventDefault();
                  mutation.mutate();
                }}
              >
                {mutation.isPending ? "Deleting..." : "Yes, Delete My Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {state === "success" && (
          <>
            <AlertDialogHeader>
              <div className="m-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-10 text-green-500" />
              </div>

              <AlertDialogTitle>Account deleted</AlertDialogTitle>

              <AlertDialogDescription>
                Your account has been permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  signOut({
                    callbackUrl: "/",
                  });
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
              <div className="m-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <CircleAlert className="size-10 text-destructive" />
              </div>

              <AlertDialogTitle>Failed to delete account</AlertDialogTitle>

              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => onOpenChange(false)}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() => {
                  setState("confirm");
                  setError("");
                }}
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
