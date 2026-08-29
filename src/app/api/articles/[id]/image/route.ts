import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { redis } from "@/lib/redis";
import { revalidateTag } from "next/cache";
import { fileTypeFromBuffer } from "file-type";




interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method  PUT
 * @route   ~/api/articles/:id/image
 * @desc    Update article image
 * @access  private (only admin)
 */
export async function PUT(
  request: NextRequest,
  { params }: Props
) {
  try {
    const session = await auth();
      const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in" },
        { status: 401 }
      );
    }

    if (!session.user.isAdmin) {
      return NextResponse.json(
        { message: "Only admin can update article image" },
        { status: 403 }
      );
    }


     const key = `article-image-change:${id}`;
   

    const exists = await redis.get(key);;

    if (exists) {
      return NextResponse.json(
        {
          message:
            "You can change an article image once every 7 days",
        },
        { status: 429 }
      );
    }

  
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { message: "Invalid article ID" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        imageUrl: true,
        imagePublicId: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Invalid image type. Only JPEG, PNG, JPG, WebP and AVIF are allowed",
        },
        { status: 400 }
      );
    }

    const maxSize = 4 * 1024 * 1024;

    if (file.size === 0) {
      return NextResponse.json(
        { message: "Image is empty" },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "Image size must be less than 5MB" },
        { status: 400 }
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
          folder: "article-images",
          public_id: `article-${articleId}`,
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
        }
      );

      uploadStream.end(buffer);
    });

    const updatedArticle = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    // Delete old image
    if (
      article.imagePublicId &&
      article.imagePublicId !== uploadResult.public_id
    ) {
      try {
        await cloudinary.uploader.destroy(article.imagePublicId);
      } catch (error) {
        console.error(
          "Failed to delete old article image:",
          error
        );
      }
    }

    await redis.set(
      `article-image-change:${articleId}`,
      "1",
      {
        nx: true,
        ex: 60 * 60 * 24 * 7,
      }
    );
    revalidateTag("articles")
    revalidateTag(`article-${id}`)
    return NextResponse.json(
      {
        message: "Article image updated successfully",
        article: updatedArticle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("updateArticleImageError:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}