"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import { Input } from "@/components/ui/input";
import { updateProfile } from "@/apiCalls/clientCalls/profile";
import { UserProfile } from "@/utils/types";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  userId: number;
  currentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (name: string) => void;
}

type State = "form" | "success" | "error";

export default function UpdateNameDialog({
  userId,
  currentName,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [state, setState] = useState<State>("form");
  const [error, setError] = useState("");
  const { update } = useSession();
  useEffect(() => {
    if (open) {
      setName(currentName);

      setState("form");
      setError("");
    }
  }, [open, currentName]);

  const mutation = useMutation({
    mutationFn: () => updateProfile(userId, name.trim()),

    onSuccess: async (data) => {
      await update({
        name: data.name,
      });
      onSuccess(name);
      router.refresh();
      onOpenChange(false);
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
      setState("form");
      setError("");
    }

    onOpenChange(value);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        {state === "form" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Change your name</AlertDialogTitle>

              <AlertDialogDescription>
                Enter your new name below.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={mutation.isPending}
            />

            <AlertDialogFooter>
              <AlertDialogCancel disabled={mutation.isPending}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={
                  mutation.isPending ||
                  !name.trim() ||
                  name.trim() === currentName
                }
                onClick={(e) => {
                  e.preventDefault();
                  mutation.mutate();
                }}
              >
                {mutation.isPending ? "Saving..." : "Save changes"}
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

              <AlertDialogTitle>Name updated successfully</AlertDialogTitle>

              <AlertDialogDescription>
                Your profile name has been updated.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogAction onClick={() => onOpenChange(false)}>
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

              <AlertDialogTitle>Failed to update name</AlertDialogTitle>

              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => onOpenChange(false)}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() => {
                  setState("form");
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
