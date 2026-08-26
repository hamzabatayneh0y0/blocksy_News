"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  updateArticleText,
  updateArticleImage,
  updateArticleTags,
  searchTags,
} from "@/apiCalls/clientCalls/articles";

import { useDebounce } from "@/utils/hooks/useDebounce";

import {
  updateArticleSchema,
  updateArticleTagsSchema,
} from "@/utils/validationSchemas";

import { MorphingInfinity } from "./morphing-infinity";
import { Article } from "@/utils/types";

interface UpdateArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  article: Article;
}

type DialogState = "form" | "success" | "error";

type UpdatingPart = "text" | "image" | "tags" | null;

export default function UpdateArticleDialog({
  open,
  onOpenChange,
  article,
}: UpdateArticleDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<DialogState>("form");
  const [error, setError] = useState("");

  /*
   * -------------------------
   * Text
   * -------------------------
   */

  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description);

  /*
   * -------------------------
   * Tags
   * -------------------------
   */

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>(article.tags);

  /*
   * -------------------------
   * Image
   * -------------------------
   */

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(article.imageUrl);

  const [isDragging, setIsDragging] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  /*
   * -------------------------
   * Search Tags
   * -------------------------
   */

  const { data: searchedTags = [], isFetching } = useQuery({
    queryKey: ["tags-search", debouncedSearch],

    queryFn: () => searchTags(debouncedSearch),

    enabled: !!debouncedSearch.replace(/\s/g, ""),

    staleTime: 60 * 1000,

    gcTime: 60 * 1000,

    refetchOnWindowFocus: false,
  });

  /*
   * -------------------------
   * Helpers
   * -------------------------
   */

  function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong";
  }

  function showError(message: string) {
    setError(message);
    setState("error");
  }

  /*
   * -------------------------
   * TEXT MUTATION
   * -------------------------
   */

  const textMutation = useMutation({
    mutationFn: () =>
      updateArticleText(article.id.toString(), title, description),

    onSuccess: () => {
      setState("success");
      router.refresh();
    },

    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });

  /*
   * -------------------------
   * IMAGE MUTATION
   * -------------------------
   */

  const imageMutation = useMutation({
    mutationFn: () => updateArticleImage(article.id.toString(), image as File),

    onSuccess: () => {
      setState("success");
      router.refresh();
    },

    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });

  /*
   * -------------------------
   * TAGS MUTATION
   * -------------------------
   */

  const tagsMutation = useMutation({
    mutationFn: () => updateArticleTags(article.id.toString(), tags),

    onSuccess: () => {
      setState("success");
      router.refresh();
    },

    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });

  const isPending =
    textMutation.isPending || imageMutation.isPending || tagsMutation.isPending;

  const updatingPart: UpdatingPart = textMutation.isPending
    ? "text"
    : imageMutation.isPending
      ? "image"
      : tagsMutation.isPending
        ? "tags"
        : null;
  const textChanged =
    title !== article.title || description !== article.description;

  const tagsChanged =
    tags.length !== article.tags.length ||
    tags.some((tag, index) => tag !== article.tags[index]);

  /*
   * -------------------------
   * Reset / Sync article
   * -------------------------
   */

  useEffect(() => {
    if (!open) return;

    setState("form");
    setError("");

    setTitle(article.title);
    setDescription(article.description);

    setTags(article.tags);

    setSearch("");

    setImage(null);
    setImagePreview(article.imageUrl);

    setIsDragging(false);
  }, [open, article]);

  /*
   * -------------------------
   * Object URL cleanup
   * -------------------------
   */

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function resetForm() {
    setState("form");
    setError("");

    setTitle(article.title);
    setDescription(article.description);

    setTags(article.tags);

    setSearch("");

    setImage(null);

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(article.imageUrl);

    setIsDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value && !isPending) {
      resetForm();
    }

    onOpenChange(value);
  }

  /*
   * -------------------------
   * IMAGE
   * -------------------------
   */

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  async function handleImage(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showError(
        "Invalid image type. Only JPEG, PNG, WebP and AVIF are allowed.",
      );
      return;
    }

    if (file.size === 0) {
      showError("Image is required.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showError("Image size must be less than 5MB.");
      return;
    }

    try {
      // const compressedFile = await imageCompression(file, {
      //   maxSizeMB: 1.5,
      //   maxWidthOrHeight: 1600,
      //   useWebWorker: true,
      // });

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      setState("form");
      setError("");
    } catch {
      showError("Failed to process the image.");
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      handleImage(file);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleImage(file);
    }
  }

  function removeNewImage() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview(article.imageUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleUpdateImage() {
    setError("");

    if (!image) {
      showError("Please select a new image first.");
      return;
    }

    imageMutation.mutate();
  }

  /*
   * -------------------------
   * TAGS
   * -------------------------
   */

  function handleSearchChange(value: string) {
    setSearch(value.replace(/\s/g, ""));
  }

  function addTag(tag?: string) {
    const value = (tag ?? search).replace(/\s/g, "");

    if (!value) {
      return;
    }

    const validation = updateArticleTagsSchema.safeParse({
      tags: [...tags, value],
    });

    if (!validation.success) {
      showError(validation.error.issues[0].message);
      return;
    }

    setTags(validation.data.tags);
    setSearch("");
  }

  function removeTag(tagToRemove: string) {
    setTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
  }

  function handleUpdateTags() {
    setError("");

    const validation = updateArticleTagsSchema.safeParse({
      tags,
    });

    if (!validation.success) {
      showError(validation.error.issues[0].message);
      return;
    }

    tagsMutation.mutate();
  }

  /*
   * -------------------------
   * TEXT
   * -------------------------
   */

  function handleUpdateText() {
    setError("");

    const validation = updateArticleSchema.safeParse({
      title,
      description,
    });

    if (!validation.success) {
      showError(validation.error.issues[0].message);
      return;
    }

    textMutation.mutate();
  }

  const showDropdown = search.replace(/\s/g, "").length > 0;

  /*
   * -------------------------
   * SUCCESS
   * -------------------------
   */

  if (state === "success") {
    return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-2 m-auto flex size-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-10 text-green-500" />
            </div>

            <AlertDialogTitle>Article updated successfully</AlertDialogTitle>

            <AlertDialogDescription>
              Your changes have been saved successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="cursor-pointer"
            >
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  /*
   * -------------------------
   * ERROR
   * -------------------------
   */

  if (state === "error") {
    return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-2 m-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-10 text-destructive" />
            </div>

            <AlertDialogTitle>Failed to update article</AlertDialogTitle>

            <AlertDialogDescription className="break-words">
              {error || "Something went wrong."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setState("form");
                setError("");
              }}
              className="cursor-pointer"
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  /*
   * -------------------------
   * FORM
   * -------------------------
   */

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl">
            Update Article
          </AlertDialogTitle>

          <AlertDialogDescription>
            Update each part of your article separately.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-8">
          {/* =========================
              TEXT SECTION
          ========================= */}

          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Article Information</h3>

              <p className="text-sm text-muted-foreground">
                Update the title and description.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                disabled={isPending}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write article description..."
                disabled={isPending}
                className="min-h-32 resize-none rounded-xl"
              />
            </div>

            <Button
              type="button"
              onClick={handleUpdateText}
              disabled={!textChanged || isPending}
              className="cursor-pointer"
            >
              {updatingPart === "text" && (
                <MorphingInfinity className="size-5" />
              )}

              {updatingPart === "text" ? "Saving..." : "Save Changes"}
            </Button>
          </section>

          {/* =========================
              IMAGE SECTION
          ========================= */}

          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Article Image</h3>

              <p className="text-sm text-muted-foreground">
                Choose a new image to replace the current one.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-xl border">
                <Image
                  src={imagePreview}
                  alt="Article preview"
                  width={800}
                  height={450}
                  className="h-56 w-full object-cover object-center sm:h-72"
                />

                {image && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={removeNewImage}
                    disabled={isPending}
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    <X />
                  </Button>
                )}
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex min-h-32 p-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="size-5 text-primary" />
                </div>

                <p className="text-sm font-medium">Drag & drop a new image</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum size: 5MB
                </p>
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-yellow-500" />

                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    You can change an article image only once every 7 days.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleUpdateImage}
              disabled={!image || isPending}
              className="cursor-pointer"
            >
              {updatingPart === "image" && (
                <MorphingInfinity className="size-5" />
              )}

              {updatingPart === "image" ? "Uploading..." : "Update Image"}
            </Button>
          </section>

          {/* =========================
              TAGS SECTION
          ========================= */}

          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Tags</h3>

              <p className="text-sm text-muted-foreground">
                Add or remove tags for this article.
              </p>
            </div>

            <div className="flex w-full gap-2">
              <div className="relative min-w-0 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Search by category..."
                    disabled={isPending || tags.length >= 5}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>

                {showDropdown && (
                  <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    <Command>
                      <CommandList>
                        {isFetching ? (
                          <div className="p-3 text-sm text-muted-foreground">
                            Searching...
                          </div>
                        ) : (
                          <>
                            <CommandEmpty>No categories found.</CommandEmpty>

                            {searchedTags
                              .filter((tag) => !tags.includes(tag.name))
                              .map((tag) => (
                                <CommandItem
                                  key={tag.name}
                                  value={tag.name}
                                  onSelect={() => addTag(tag.name)}
                                  className="cursor-pointer"
                                >
                                  <span>{tag.name}</span>

                                  <span className="ml-auto text-xs text-muted-foreground">
                                    {tag.count} articles
                                  </span>
                                </CommandItem>
                              ))}
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={() => addTag()}
                disabled={
                  !search.trim() ||
                  tags.length >= 5 ||
                  isPending ||
                  !tagsChanged
                }
                className="h-11 shrink-0 cursor-pointer"
              >
                <Plus className="size-4" />

                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary"
                  >
                    <span>{tag}</span>

                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={isPending}
                      className="cursor-pointer rounded-full p-0.5 hover:bg-primary/10"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {tags.length}/5 tags
            </p>

            <Button
              type="button"
              onClick={handleUpdateTags}
              disabled={isPending}
              className="cursor-pointer"
            >
              {updatingPart === "tags" && (
                <MorphingInfinity className="size-5" />
              )}

              {updatingPart === "tags" ? "Saving..." : "Save Tags"}
            </Button>
          </section>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="cursor-pointer">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
