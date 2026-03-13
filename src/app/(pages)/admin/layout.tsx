import AdminSidebar from "@/components/adminSidebar";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard | Articles Platform",
  description:
    "Admin control panel to manage articles, comments, and users on the platform.",
  openGraph: {
    title: "Admin Dashboard | Articles Platform",
    description:
      "Manage articles, users, and platform content from the admin dashboard.",
    images: ["/public/next.svg"],
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);
  if (!payload || !payload.isAdmin) redirect("/");

  return (
    <div className="my-1 flex gap-1 overflow-hidden">
      <AdminSidebar payload={payload} />
      <main className="flex-1 bg-white dark:bg-black dark:shadow-2xl dark:shadow-white  py-1 px-5 not-sm:overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
