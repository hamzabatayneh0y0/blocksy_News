"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { UserComment } from "@/utils/types";

interface Props {
  comment: UserComment;
}

export default function ProfileComment({ comment }: Props) {
  return (
    <Link
      href={`/articles/${comment.article.id}`}
      className="block rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <MessageCircle className="size-4 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6">{comment.text}</p>

          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
