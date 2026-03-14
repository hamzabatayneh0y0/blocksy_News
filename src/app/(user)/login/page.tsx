import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login ",
  description:
    "Access your account to manage your profile, bookmarks, and activity on the platform.",
  openGraph: {
    title: "Login",
    description:
      "Sign in to your account and continue exploring articles on our platform.",
    images: ["/public/next.svg"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Login() {
  return (
    <div className="login flex items-center justify-center h-screen p-2">
      <div className="w-9/12  border shadow-2xl p-3">
        <LoginForm />
      </div>
    </div>
  );
}
