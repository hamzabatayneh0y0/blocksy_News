"use server";

import { signOut } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const LogOutAction = async () => {
  try {
    await signOut({ redirectTo: "/login" });

    return {
      message: "Logout successful",
      ok: true,
    };
  } catch (err: any) {
    if (isRedirectError(err)) {
      return {
        message: "Logout successful",
        ok: true,
      };
    }

    if (err instanceof AuthError) {
      return {
        message: err.cause?.err?.message ?? "Logout failed",
        ok: false,
      };
    }

    return {
      message: err?.message || "Something went wrong",
      ok: false,
    };
  }
};