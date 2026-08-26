"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Trash2,
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

import imageCompression from "browser-image-compression";

import { createArticle, searchTags } from "@/apiCalls/clientCalls/articles";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { createArticleSchema, tagsSchema } from "@/utils/validationSchemas";
import { MorphingInfinity } from "./morphing-infinity";

interface CreateArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DialogState = "form" | "success" | "error";

export default function CreateArticleDialog({
  open,
  onOpenChange,
}: CreateArticleDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<DialogState>("form");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { data: searchedTags = [], isFetching } = useQuery({
    queryKey: ["tags-search", debouncedSearch],

    queryFn: () => searchTags(debouncedSearch),

    enabled: !!debouncedSearch.replace(/\s/g, ""),

    staleTime: 60 * 1000,

    gcTime: 60 * 1000,

    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => createArticle(title, description, tags, image as File),

    onSuccess: () => {
      setState("success");
      router.refresh();
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

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function resetForm() {
    setState("form");
    setError("");

    setTitle("");
    setDescription("");
    setSearch("");
    setTags([]);

    setImage(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
    setIsDragging(false);
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      resetForm();
    }
    onOpenChange(value);
  }

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  async function handleImage(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        "Invalid image type. Only JPEG, PNG, WebP and AVIF are allowed.",
      );
      setState("error");
      return;
    }

    if (file.size === 0) {
      setError("Image is required.");
      setState("error");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5MB.");
      setState("error");
      return;
    }

    try {
      // const compressedFile = await imageCompression(file, {
      //   maxSizeMB: 1.5,
      //   maxWidthOrHeight: 1600,
      //   useWebWorker: true,
      // });

      // if (imagePreview) {
      //   URL.revokeObjectURL(imagePreview);
      // }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      setState("form");
      setError("");
    } catch {
      setError("Failed to process the image.");
      setState("error");
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

  function handleSearchChange(value: string) {
    const cleanedValue = value.replace(/\s/g, "");

    setSearch(cleanedValue);
  }

  function addTag(tag?: string) {
    const value = (tag ?? search).replace(/\s/g, "");

    if (!value) {
      return;
    }

    const validation = tagsSchema.safeParse([...tags, value]);

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setState("error");
      return;
    }

    setTags(validation.data);
    setSearch("");
  }

  function removeTag(tagToRemove: string) {
    setTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
  }

  function handleCreateArticle() {
    setError("");

    const validation = createArticleSchema.safeParse({
      title,
      description,
      tags,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setState("error");
      return;
    }

    if (!image) {
      setError("Article image is required.");
      setState("error");
      return;
    }

    mutate();
  }

  const showDropdown = search.replace(/\s/g, "").length > 0;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {state === "form" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl sm:text-2xl">
                Create New Article
              </AlertDialogTitle>

              <AlertDialogDescription>
                Create a new article by adding its title, description, image,
                and tags.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-5">
              {/* Title */}
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

              {/* Description */}
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

              {/* Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Article Image</label>

                {!imagePreview ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/40"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="size-6 text-primary" />
                    </div>

                    <p className="text-sm font-medium">
                      Drag & drop your image here
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      or click to browse
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Maximum size: 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    <Image
                      src={imagePreview}
                      alt="Article preview"
                      width={800}
                      height={450}
                      className="h-56 w-full object-cover sm:h-72 object-center"
                    />

                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        if (imagePreview) {
                          URL.revokeObjectURL(imagePreview);
                        }

                        setImage(null);
                        setImagePreview("");

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute right-3 top-3 cursor-pointer"
                    >
                      <X />
                    </Button>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tags</label>

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
                                <CommandEmpty>
                                  No categories found.
                                </CommandEmpty>

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
                    disabled={!search.trim() || tags.length >= 5 || isPending}
                    className="h-11 shrink-0 cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </div>

                {/* Selected tags */}
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
              </div>
            </div>

            <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
              <AlertDialogCancel
                disabled={isPending}
                className="w-full cursor-pointer sm:w-auto"
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateArticle();
                }}
                disabled={isPending}
                className="w-full cursor-pointer sm:w-auto"
              >
                {isPending && <MorphingInfinity className="size-6" />}

                {isPending ? "Creating..." : "Create Article"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {state === "success" && (
          <>
            <AlertDialogHeader>
              <div className="mb-2 flex size-12 m-auto items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-10 text-green-500" />
              </div>

              <AlertDialogTitle>Article created successfully</AlertDialogTitle>

              <AlertDialogDescription>
                Your article has been created successfully.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  onOpenChange(false);
                  resetForm();

                  setState("form");
                }}
                className="cursor-pointer"
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
                <AlertCircle className="size-10 text-destructive" />
              </div>

              <AlertDialogTitle>Failed to create article</AlertDialogTitle>

              <AlertDialogDescription className="break-words">
                {error || "Something went wrong."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setState("form");
                  setError("");
                }}
                className="cursor-pointer"
              >
                Back
              </AlertDialogCancel>

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
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
