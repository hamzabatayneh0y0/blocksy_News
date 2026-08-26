"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleAlert } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");

  let message = "An error occurred during authentication.";

  switch (error) {
    case "OAuthAccountNotLinked":
      message =
        "This email is already associated with another account. Please sign in using the original method.";
      break;

    case "AccessDenied":
      message =
        "Access was denied, your email is not verified. Sign in with your email and password to verify your email.";
      break;

    case "OAuthSignin":
      message = "Unable to start the OAuth sign-in process.";
      break;

    case "OAuthCallback":
      message = "An error occurred while processing the OAuth callback.";
      break;

    case "OAuthCreateAccount":
      message = "Could not create your account.";
      break;

    case "EmailCreateAccount":
      message = "Could not create your account using email.";
      break;

    case "Configuration":
      message = "There is a server configuration error.";
      break;

    case "EmailNotVerified":
      message =
        "Your email is not verified. Sign in with your email and password to verify your email.";
      break;

    default:
      message = "Something went wrong. Please try again.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-destructive/10">
          <CircleAlert className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          Authentication Error
        </h1>

        <p className="text-sm md:text-base font-medium text-muted-foreground mb-8">
          {message}
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center bg-primary hover:opacity-90 text-primary-foreground font-semibold px-6 py-3 rounded-xl"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
