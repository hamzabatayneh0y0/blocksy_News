import ResetPasswordForm from "@/components/ResetPasswordForm";
import { redis } from "@/lib/redis";

export const metadata = {
  title: "Reset Password",
  description:
    "Create a new password for your Blocksy account and regain access.",
};

interface Props {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPassword({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return <ErrorCard />;
  }

  const resetPasswordToken = (await redis.get(`forgotPassword:${token}`)) as {
    email: string;
  };

  if (!resetPasswordToken) {
    return <ErrorCard />;
  }

  await redis.del(`forgotPassword:${token}`);

  return <ResetPasswordForm email={resetPasswordToken.email || ""} />;
}

function ErrorCard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-destructive">
          Invalid Reset Password Link
        </h1>

        <p className="mt-3 text-muted-foreground">
          This link is expired or invalid.
        </p>
      </div>
    </div>
  );
}
