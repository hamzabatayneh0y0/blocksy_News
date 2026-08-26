import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Articles Platform",
  description:
    "Admin control panel to manage articles, comments, and users on the platform.",
  openGraph: {
    title: "Admin Dashboard | Articles Platform",
    description:
      "Manage articles, users, and platform content from the admin dashboard.",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="">{children}</main>
    </div>
  );
}
