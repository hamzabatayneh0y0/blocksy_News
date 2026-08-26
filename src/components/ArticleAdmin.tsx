"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

import Article from "./Article";
import { Dispatch, SetStateAction, useState } from "react";
import DeleteArticleDialog from "./deleteArticleConfirmation";
import UpdateArticleDialog from "./updateArticleDialog";

type AdminProps = {
  tags: string[];
  likesCount: number;
  savedCount: number;
  title: string;
  id: number;
  description: string;
  imageUrl: string;
  createdAt: Date;
  setSelectedArticles: Dispatch<SetStateAction<number[]>>;
  selectedArticles: number[];
};

export default function ArticleAdmin({
  id,
  tags,
  likesCount,
  savedCount,
  title,
  description,
  imageUrl,
  createdAt,
  setSelectedArticles,
  selectedArticles,
}: AdminProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  function handleUpdate() {
    setUpdateDialogOpen(true);
  }

  function handleDelete() {
    setDeleteDialogOpen(true);
  }

  function handleSelect(checked: boolean) {
    if (checked && selectedArticles.length <= 10) {
      setSelectedArticles((prev) => [...prev, id]);
    } else {
      setSelectedArticles((prev) =>
        prev.filter((articleId) => articleId !== id),
      );
    }
  }
  return (
    <div className="w-full rounded-xl bg-card p-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
      {/* Admin controls */}
      <div className="mb-3 flex items-center justify-between flex-wrap gap-0.5">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`article-${id}`}
            onCheckedChange={handleSelect}
            className={"cursor-pointer"}
            checked={selectedArticles.includes(id) || false}
          />

          <label
            htmlFor={`article-${id}`}
            className="cursor-pointer text-sm text-muted-foreground"
          >
            Select
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUpdate}
            className="gap-2 cursor-pointer"
          >
            <Pencil className="size-4" />
            Update
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-2 cursor-pointer"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Article */}
      <Article
        id={id}
        tags={tags}
        likesCount={likesCount}
        savedCount={savedCount}
        title={title}
        description={description}
        imageUrl={imageUrl}
        createdAt={createdAt}
      />
      <DeleteArticleDialog
        articleIds={[id]}
        setArticleIds={setSelectedArticles}
        manyArticles={false}
        numberOfArticles={1}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      <UpdateArticleDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        article={{
          id,
          tags,
          likesCount,
          savedCount,
          title,
          description,
          imageUrl,
          createdAt,
        }}
      />
    </div>
  );
}
