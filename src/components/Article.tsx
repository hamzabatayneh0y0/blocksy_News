"use client";

import Image from "next/image";
import { useState } from "react";
import { Bookmark, Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ArticleTag from "./ArticleTag";
import { Article } from "@/utils/types";
import Link from "next/link";

export default function ArticleComponent({
  tags,
  likesCount,
  savedCount,
  title,
  id,
  description,
  imageUrl,
  createdAt,
}: Article) {
  const [likes, setLikes] = useState(likesCount);
  const [saves, setSaves] = useState(savedCount);

  const handleShare = async () => {
    const url = `${window.location.origin}/articles/${id}`;

    if (navigator.share) {
      await navigator.share({
        title,
        text: description,
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <article className="w-full overflow-hidden rounded-xl bg-card p-2">
      <div className="flex flex-col gap-5  ">
        {/* Image */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg ">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, 700px"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
            <Link
              href={`/articles/${id}`}
              title="Read the article"
              className="block"
            >
              <h2 className="line-clamp-2 text-xl font-semibold tracking-tight">
                {title}
              </h2>
            </Link>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>

            {/* Tags */}
            {tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    href={`/articles?searchText=${encodeURIComponent(tag)}`}
                    key={tag}
                  >
                    <ArticleTag tag={tag} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Interaction */}
          <div className="mt-5 flex items-center gap-1 border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2  hover:bg-transparent hover:text-inherit"
            >
              <Heart className="size-4" fill={"none"} />
              <span>{likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-transparent hover:text-inherit"
            >
              <Bookmark className="size-4" fill={"none"} />
              <span>{saves}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="ml-auto gap-2 cursor-pointer"
            >
              <Share2 className="size-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
