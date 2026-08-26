"use client";

import Image from "next/image";
import { useState } from "react";
import { Pencil, Camera, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import UpdateProfileImageDialog from "./UpdateProfileImageDialog";
import DeleteAccountDialog from "./DeleteAccountDialog";
import { UserProfile } from "@/utils/types";
import UpdateNameDialog from "./UpdateProfileNameDialog";

interface Props {
  user: UserProfile;
}

export default function ProfileInfo({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image);
  const avatar =
    "../../public/images/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.avif";

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [nameDialog, setNameDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  return (
    <>
      <section className="rounded-xl border bg-card p-5">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative">
            <div className="relative size-28 overflow-hidden rounded-full border">
              <Image
                src={image || avatar}
                alt={name}
                fill
                className="object-cover object-center"
                sizes="112px"
              />
            </div>

            <Button
              size="icon"
              variant="secondary"
              onClick={() => setImageDialog(true)}
              className="absolute bottom-0 right-0 size-9 cursor-pointer rounded-full border"
            >
              <Camera className="size-4" />
            </Button>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h1 className="text-2xl font-bold break-all">{name}</h1>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNameDialog(true)}
                className="size-8 cursor-pointer"
              >
                <Pencil className="size-4" />
              </Button>
            </div>

            <p className="mt-1 break-all text-sm text-muted-foreground">
              {user.email}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t pt-5">
          <Button
            variant="destructive"
            onClick={() => setDeleteDialog(true)}
            className="w-full cursor-pointer sm:w-auto flex flex-wrap h-auto p-1"
          >
            <Trash2 className="size-4" />
            <p className=" break-all text-sm">Delete my account</p>
          </Button>
        </div>
      </section>

      <UpdateNameDialog
        userId={user.id}
        currentName={name}
        open={nameDialog}
        onOpenChange={setNameDialog}
        onSuccess={setName}
      />

      <UpdateProfileImageDialog
        userId={user.id}
        currentImage={image}
        open={imageDialog}
        onOpenChange={setImageDialog}
        onSuccess={setImage}
      />

      <DeleteAccountDialog
        userId={user.id}
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
      />
    </>
  );
}
