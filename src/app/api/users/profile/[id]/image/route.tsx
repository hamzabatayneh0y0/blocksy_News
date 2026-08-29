import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { redis } from "@/lib/redis";
import { uploudProfileImageLimite } from "@/utils/uploadImageLimite";
import { revalidateTag } from "next/cache";
import { fileTypeFromBuffer } from "file-type";
interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method  PUT
 * @route   ~/api/users/profile/:id/image
 * @desc    Update profile image
 * @access  private
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in" },
        { status: 401 },
      );
    }

    const exists = await uploudProfileImageLimite(session?.user?.id);

    if (exists) {
      return Response.json(
        { message: "You can change your profile picture once every 7 days" },
        { status: 429 },
      );
    }

    const { id } = await params;

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const sessionUserId = parseInt(session.user.id);

    if (isNaN(sessionUserId)) {
      return NextResponse.json(
        { message: "Invalid session user ID" },
        { status: 401 },
      );
    }

    if (sessionUserId !== userId) {
      return NextResponse.json(
        {
          message: "Only the account owner can update this image",
        },
        { status: 403 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        image: true,
        imagePublicId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 },
      );
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Invalid image type. Only JPEG, PNG,JPG and WebP are allowed",
        },
        { status: 400 },
      );
    }

    const maxSize = 4 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "Image size must be less than 4MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detectedType = await fileTypeFromBuffer(buffer);

    if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
      return NextResponse.json(
        {
          message: "Invalid image content. File does not match declared type.",
        },
        { status: 400 },
      );
    }
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile-images",
          public_id: `user-${userId}`,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      },
      select: {
        id: true,

        image: true,
      },
    });

    if (user.imagePublicId && user.imagePublicId !== uploadResult.public_id) {
      try {
        await cloudinary.uploader.destroy(user.imagePublicId);
      } catch (error) {
        console.error("Failed to delete old profile image:", error);
      }
    }
    await redis.set(`profile-image-change:user:${session.user.id}`, "1", {
      nx: true,
      ex: 60 * 60 * 24 * 7,
    });
    revalidateTag(`user-profile-${userId}`);
    return NextResponse.json(
      {
        message: "Profile image updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("uploadProfileImage:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
