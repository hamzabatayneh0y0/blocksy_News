"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getArticlesProps } from "@/utils/types";
import { useState } from "react";
import ArticleAdmin from "./ArticleAdmin";
import ArticlePagination from "./Pagination";
import DeleteArticleDialog from "./deleteArticleConfirmation";
import CreateArticleDialog from "./createArticleDialog";
import { Plus } from "lucide-react";

export default function AdminContent({
  articles,
  totalArticles,
  totalPages,
  currentPage,
  sort,
  searchText,
}: getArticlesProps & { searchText: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const currentSort = searchParams.get("sort") ?? "latest";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createArticleOpen, setCreateArticleOpen] = useState(false);
  function handleFilterChange(value: string | null) {
    if (!value) return;
    router.push(`/admin?sort=${value}&searchText=${searchText}&pageNumber=1`);
  }

  function handleDeleteArticles() {
    setDeleteDialogOpen(true);
  }
  function handleSelectAll() {
    const allArticleIds = articles.slice(0, 10).map((article) => article.id);
    const allSelected = allArticleIds.every((id) =>
      selectedArticles.includes(id),
    );

    setSelectedArticles(allSelected ? [] : allArticleIds);
  }

  return (
    <div className="w-full">
      <div className="w-full flex items-center  flex-wrap justify-between gap-4 rounded-lg border bg-card p-4">
        {/* Filter */}
        <Select value={currentSort} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[150px] cursor-pointer">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem className={" cursor-pointer"} value="latest">
              Latest
            </SelectItem>
            <SelectItem className={" cursor-pointer"} value="oldest">
              Oldest
            </SelectItem>
            <SelectItem className={" cursor-pointer"} value="popular">
              Popular
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Selection */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">
            Selected:
            <span className="font-semibold text-foreground">
              {selectedArticles.length}
            </span>
          </span>

          <Button
            type="button"
            variant="outline"
            onClick={handleSelectAll}
            className={" cursor-pointer"}
          >
            {selectedArticles.length === 10 && totalArticles !== 0
              ? "Unselect All"
              : "Select All"}
          </Button>
          <Button
            type="button"
            onClick={() => setCreateArticleOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="size-4" />
            Create Article
          </Button>
          <Button
            type="button"
            onClick={handleDeleteArticles}
            variant="destructive"
            disabled={!selectedArticles.length}
            className={
              selectedArticles.length
                ? "pointer-events-auto cursor-pointer"
                : "pointer-events-none opacity-50"
            }
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6  py-12 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleAdmin
            key={article.id}
            {...article}
            setSelectedArticles={setSelectedArticles}
            selectedArticles={selectedArticles}
          />
        ))}
      </div>
      <div className="py-12">
        <ArticlePagination
          currentPage={currentPage}
          lastIndex={currentPage}
          searchText={searchText}
          sort={sort}
        />
      </div>
      <DeleteArticleDialog
        articleIds={selectedArticles}
        setArticleIds={setSelectedArticles}
        manyArticles={selectedArticles.length > 1}
        numberOfArticles={selectedArticles.length}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      <CreateArticleDialog
        open={createArticleOpen}
        onOpenChange={setCreateArticleOpen}
      />
    </div>
  );
}
