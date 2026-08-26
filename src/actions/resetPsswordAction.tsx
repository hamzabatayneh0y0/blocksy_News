"use server";

import { resetPasswordSchema } from "@/utils/validationSchemas";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const resetPsswordAction = async (
  userPassword: string,
  userEmail: string,
) => {
  try {
    const validation = resetPasswordSchema.safeParse({
      password: userPassword,
    });

    if (!validation.success) {
      console.log("passwordAction", userPassword);

      return {
        success: false,
        message: validation.error.errors[0].message,
      };
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = await prisma.user.update({
      where: { email: userEmail },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid Email",
      };
    }

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (err: any) {
    console.log("resetPsswordAction-CatchError:", err);

    if (err instanceof AuthError) {
      return {
        success: false,
        message: err.cause?.err?.message ?? "something went wrong",
      };
    }

    return {
      success: false,
      message: err.message || "something went wrong",
    };
  }
};
