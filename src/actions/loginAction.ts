"use server";

import { createVerificationToken } from "@/utils/generateVerifycationToken";
import { LogInRateLimit } from "@/utils/loginratelimite";
import { loginSchema } from "@/utils/validationSchemas";
import { sendVerificationEmail } from "@/utils/ٍsendVerifycationEmail";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import { signIn } from "@/auth";

export const loginAction = async (
  email: string,
  password: string
) => {
  try {
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      return {
        message: validation.error.errors[0].message,
        ok: false,
      };
    }

    const allowed = await LogInRateLimit(email);

    if (!allowed) {
      return {
        message: "Too many requests, please try again later",
        ok: false,
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      message: "Login successful",
      ok: true,
    };
  } catch (err: any) {
    console.log("LoginAction-CatchError:", err);

    if (err instanceof AuthError) {
      if (
        err.type === "CredentialsSignin" &&
        "code" in err
      ) {
        if (err.code === "EMAIL_NOT_VERIFIED") {
          const user = await prisma.user.findUnique({
            where: { email },
            select: { email: true },
          });

          if (!user) {
            return {
              message: "Invalid Email Or Password",
              ok: false,
            };
          }

          try {
            const { email: userEmail, token } =
              await createVerificationToken(email);

            await sendVerificationEmail(userEmail, token);
          } catch (error) {
            console.error(
              "Failed to send verification email:",
              error
            );

            return {
              message: "Failed to send verification email",
              ok: false,
            };
          }

          return {
            message:
              "We've sent a verification email. Please verify your account within 2 minutes.",
            ok: false,
          };
        }

        if (err.code === "INVALID_CREDENTIALS") {
          return {
            message: "Invalid email or password",
            ok: false,
          };
        }
      }

      return {
        message: "Login failed",
        ok: false,
      };
    }

    return {
      message: err?.message || "Something went wrong",
      ok: false,
    };
  }
};