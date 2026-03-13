import RegesterForm from "./regesterForm";

export const metadata = {
  title: "Register",
  description:
    "Create a new account to access your profile, bookmarks, and personalized content on our platform.",
  openGraph: {
    title: "Register",
    description:
      "Sign up to start reading, bookmarking, and interacting with articles on our platform.",
    images: ["/public/next.svg"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Regester() {
  return (
    <div className="login flex items-center justify-center h-screen p-2">
      <div className="w-9/12  border shadow-2xl p-3">
        <RegesterForm />
      </div>
    </div>
  );
}
