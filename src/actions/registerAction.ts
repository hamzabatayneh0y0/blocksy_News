"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { registerSchema } from "@/utils/validationSchemas";
import { createVerificationToken } from "@/utils/generateVerifycationToken";
import { sendVerificationEmail } from "@/utils/ٍsendVerifycationEmail";

export const registerAction = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const validation = registerSchema.safeParse({
      username,
      email,
      password,
    });

    if (!validation.success) {
      return {
        message: validation.error.errors[0].message,
        ok: false,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return {
        message: "This user already exists, please login",
        ok: false,
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    try {
      const { email: userEmail, token } =
        await createVerificationToken(email);

      await sendVerificationEmail(userEmail, token);
    } catch (error) {
      console.error("Failed to send verification email:", error);

      return {
        message: "Failed to send verification email",
        ok: false,
      };
    }

    return {
      message:
        "We've sent a verification email. Please verify your account within 2 minutes.",
      ok: true,
    };
  } catch (err: any) {
    console.log("RegisterAction-CatchError:", err);

    if (err instanceof AuthError) {
      return {
        message: "Register failed",
        ok: false,
      };
    }

    return {
      message: err.message || "something went wrong",
      ok: false,
    };
  }
};