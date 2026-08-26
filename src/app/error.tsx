"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center bg-card border border-border rounded-2xl shadow-sm p-8">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-destructive/10">
          <CircleAlert className="w-8 h-8 text-destructive" />
        </div>

        <h2 className="text-xl md:text-3xl font-bold leading-tight mb-6 text-foreground">
          Something went wrong
        </h2>

        <p className="text-muted-foreground mb-7">Please try again later.</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center bg-primary hover:opacity-90 text-primary-foreground font-semibold px-6 py-3 rounded-xl cursor-pointer"
          >
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center bg-secondary hover:bg-accent text-secondary-foreground font-semibold px-6 py-3 rounded-xl"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
