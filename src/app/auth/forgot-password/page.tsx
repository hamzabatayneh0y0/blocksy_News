"use client";

import { forgotPasswordAction } from "@/actions/forgotPasswordAction";
import { MorphingInfinity } from "@/components/morphing-infinity";
import { forgotPasswordSchema } from "@/utils/validationSchemas";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const validation = forgotPasswordSchema.safeParse({ email });

      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setLoading(false);
        return;
      }

      const data = await forgotPasswordAction(email);
      toast.info(data?.message || "Something went wrong");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Forgot Password
          </h1>

          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          name="email-forgot-password"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <MorphingInfinity className="size-7" />
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </div>
  );
}
