"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CircleAlert, Upload, X } from "lucide-react";

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
import { updateProfileImage } from "@/apiCalls/clientCalls/profile";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileImageCropper from "./ProfileImageCropper";

interface Props {
  userId: number;
  currentImage: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (image: string) => void;
}

type State = "form" | "success" | "error";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_DIMENSION = 1600;

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  const base64 = btoa(binary);
  return `data:${file.type};base64,${base64}`;
}

export default function UpdateProfileImageDialog({
  userId,
  currentImage,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const userAvatar =
    "/images/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.avif";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(currentImage || userAvatar);
  const [isDragging, setIsDragging] = useState(false);
  const [state, setState] = useState<State>("form");
  const [error, setError] = useState("");
  const { update } = useSession();
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => updateProfileImage(userId, image as File),

    onSuccess: async (data) => {
      onSuccess(data.user.image);
      await update({ image: data.user.image });
      setState("success");
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

  useEffect(() => {
    if (!open) return;

    setImage(null);
    setImagePreview(currentImage || userAvatar);
    setIsDragging(false);
    setState("form");
    setError("");
    setCropImageSrc(null);
  }, [open, currentImage]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function handleImage(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Invalid image type. Only JPEG, PNG and WebP are allowed.");
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
      const previewUrl = await fileToDataUrl(file);
      setCropImageSrc(previewUrl);
      setState("form");
      setError("");
    } catch (err: any) {
      console.error("handleImage error:", err);
      setError(`Failed to process the image`);
      setState("error");
    }
  }
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleImage(file);
    }
    e.target.value = "";
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
    setImagePreview(currentImage || userAvatar);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setState("form");
      setError("");
    }
    onOpenChange(value);
  }

  function handleCroppedImage(file: File) {
    setCropImageSrc(null);
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  if (state === "error") {
    return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="m-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <CircleAlert className="size-10 text-destructive" />
            </div>

            <AlertDialogTitle>
              Failed to update profile picture
            </AlertDialogTitle>

            <AlertDialogDescription className="break-words">
              {error || "Something went wrong."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                setState("form");
                setError("");
              }}
            >
              Try again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <>
      {cropImageSrc ? (
        <ProfileImageCropper
          imageSrc={cropImageSrc}
          onCrop={handleCroppedImage}
          onCancel={() => {
            if (cropImageSrc?.startsWith("blob:")) {
              URL.revokeObjectURL(cropImageSrc);
            }
            setCropImageSrc(null);
          }}
        />
      ) : (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change profile picture</AlertDialogTitle>

              <AlertDialogDescription>
                Choose a new profile picture. You can change it once every 7
                days.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-3">
              <div className="relative mx-auto size-40 overflow-hidden rounded-full border">
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                  unoptimized={
                    imagePreview.startsWith("blob:") ||
                    imagePreview.startsWith("data:")
                  }
                  sizes="160px"
                />

                {image && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={removeNewImage}
                    disabled={mutation.isPending}
                    className="absolute right-2 top-2 size-8"
                  >
                    <X className="size-4" />
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
                className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="size-5 text-primary" />
                </div>

                <p className="text-sm font-medium">Drag & drop an image</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum size: 5MB
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-yellow-500" />

                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  You can change your profile picture only once every 7 days.
                </p>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={mutation.isPending}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={!image || mutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  mutation.mutate();
                }}
              >
                {mutation.isPending ? "Uploading..." : "Update Picture"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
