import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "login",
  description:
    "Access your account to manage your profile, bookmarks, and activity on the platform.",
  openGraph: {
    title: "Login",
    description:
      "Sign in to your account and continue exploring articles on our platform.",
  },
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (error) {
    redirect(`/auth/error?error=${error}`);
  }

  return (
    <div className="login flex items-center justify-center min-h-screen p-2">
      <div className="w-full max-w-lg rounded shadow-md p-3">
        <LoginForm />
      </div>
    </div>
  );
}
