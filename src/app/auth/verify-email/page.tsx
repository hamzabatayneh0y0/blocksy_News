import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { MailCheck, MailX } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to activate your Blocksy account and access all features.",
};

interface Props {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmail({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <VerificationCard
        type="error"
        title="Invalid verification link"
        description="The verification link is missing or invalid."
      />
    );
  }

  const verificationToken = (await redis.get(`verification:${token}`)) as {
    email: string;
  };

  if (!verificationToken) {
    return (
      <VerificationCard
        type="error"
        title="Verification failed"
        description="This verification link has expired or is invalid."
      />
    );
  }

  await prisma.user.update({
    where: {
      email: verificationToken.email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await redis.del(`verification:${token}`);

  return (
    <VerificationCard
      type="success"
      title="Email verified successfully"
      description="Your email has been verified. You can now sign in to your account."
    />
  );
}

function VerificationCard({
  type,
  title,
  description,
}: {
  type: "success" | "error";
  title: string;
  description: string;
}) {
  const isSuccess = type === "success";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-5 flex justify-center">
          {isSuccess ? (
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <MailCheck className="size-8 text-green-600" />
            </div>
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <MailX className="size-8 text-destructive" />
            </div>
          )}
        </div>

        <h1
          className={`mb-3 text-2xl font-bold ${
            isSuccess ? "text-green-600" : "text-destructive"
          }`}
        >
          {title}
        </h1>

        <p className="mb-7 text-muted-foreground">{description}</p>

        <Link
          href={isSuccess ? "/login?verified=true" : "/login"}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
