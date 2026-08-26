"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpdateArticleDialog from "./updateArticleDialog";
import DeleteArticleDialog from "./deleteArticleConfirmation";
import { Article } from "@/utils/types";

export default function AdminInterAtions({ article }: { article: Article }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  function handleUpdate() {
    setUpdateDialogOpen(true);
  }

  function handleDelete() {
    setDeleteDialogOpen(true);
  }
  return (
    <div className="flex items-center gap-2 mt-5 flex-wrap">
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

      <DeleteArticleDialog
        articleIds={[article.id]}
        manyArticles={false}
        numberOfArticles={1}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          window.location.replace("/login");
        }}
      />

      <UpdateArticleDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        article={article}
      />
    </div>
  );
}
