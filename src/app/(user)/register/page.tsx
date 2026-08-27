import { redirect } from "next/navigation";
import RegesterForm from "./regesterForm";
export const metadata = {
  title: "register",
  description:
    "Create a new account to access your profile, bookmarks, and personalized content on our platform.",
  openGraph: {
    title: "Register",
    description:
      "Sign up to start reading, bookmarking, and interacting with articles on our platform.",
  },
};

export default async function Regester({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (error) {
    redirect(`/auth/error?error=${error}`);
  }

  return (
    <div className="regester flex items-center justify-center min-h-screen p-2">
      <div className="w-full max-w-lg  rounded shadow-md p-3">
        <RegesterForm />
      </div>
    </div>
  );
}
