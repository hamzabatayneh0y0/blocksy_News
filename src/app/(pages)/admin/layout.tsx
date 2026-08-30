import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from 'next/navigation'

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
  const session =await auth()
if(!session?.user||!session?.user?.isAdmin)
{
  redirect("/")
}
  return (
    <div>
      <main className="">{children}</main>
    </div>
  );
}
