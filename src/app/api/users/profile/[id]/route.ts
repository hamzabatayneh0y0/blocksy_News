import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { UpdateUserDto } from '@/utils/dtos';
import { updateUserSchema } from '@/utils/validationSchemas';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import cloudinary from '@/lib/cloudinary';
import { revalidateTag } from 'next/cache';

interface Props {
     params: Promise<{ id: string; }>; 
}

/**
 * @method  DELETE
 * @route   ~/api/users/profile/:id
 * @desc    Delete Profile
 * @access  private
 */
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in to delete your account" },
        { status: 401 }
      );
    }

    const sessionUserId = parseInt(session.user.id);

    if (isNaN(sessionUserId)) {
      return NextResponse.json(
        { message: "Invalid session user ID" },
        { status: 401 }
      );
    }

    if (sessionUserId !== userId && !session.user.isAdmin) {
      return NextResponse.json(
        {
          message: "Only the account owner and Admin can delete this profile",
        },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    imagePublicId: true,
  },
});

if (!user) {
  return NextResponse.json(
    { message: "User not found" },
    { status: 404 }
  );
}


 
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    if (user.imagePublicId) {
  try {
    await cloudinary.uploader.destroy(user.imagePublicId);
  } catch (error) {
    console.error("Failed to delete profile image:", error);
  }
}
 revalidateTag(`user-profile-${userId}`);
revalidateTag(  `user-foryou-${userId}`)
    return NextResponse.json(
      {
        message: "Your account has been deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("deleteProfile:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code ==="P2025") {
     
       
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
          );

        }
      

     
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * @method  GET
 * @route   ~/api/users/profile/:id
 * @desc    Get Profile By Id
 * @access  private (only user himself can get his account/profile)
 */
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in to access your profile" },
        { status: 401 }
      );
    }

    const sessionUserId = parseInt(session.user.id);

    if (isNaN(sessionUserId)) {
      return NextResponse.json(
        { message: "Invalid session user ID" },
        { status: 401 }
      );
    }

    if (sessionUserId !== userId) {
      return NextResponse.json(
        { message: "You are not allowed to access this profile" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.error("getProfile:", error);

   

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}


/**
 * @method  PUT
 * @route   ~/api/users/profile/:id
 * @desc    Update Profile
 * @access  private (only user himself can update his account/profile)
 */
export async function PUT(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in to update your profile" },
        { status: 401 }
      );
    }

    const sessionUserId = parseInt(session.user.id);

    if (isNaN(sessionUserId)) {
      return NextResponse.json(
        { message: "Invalid session user ID" },
        { status: 401 }
      );
    }

    if (sessionUserId !== userId) {
      return NextResponse.json(
        { message: "You are not allowed to update this profile" },
        { status: 403 }
      );
    }

    const body = await request.json() as UpdateUserDto;
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
    

      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: validation.data.name,
      },
      select: {
        id: true,
        name: true,
     
      },
    });
    revalidateTag(`user-profile-${userId}`);
    return NextResponse.json(updatedUser, {
      status: 200,
    });
  } catch (error) {
    console.error("updateProfile:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
          );

        case "P2002":
          return NextResponse.json(
            { message: "Email is already in use" },
            { status: 409 }
          );

        default:
          return NextResponse.json(
            { message: "Database operation failed" },
            { status: 500 }
          );
      }
    }

   

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}


