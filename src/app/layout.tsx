import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blocksy News",
  description: "your way to now ",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const dark = (await cookies()).get("dark")?.value;

  return (
    <html lang="en" className={dark === "true" ? "dark" : ""}>
      <body
        className={`${inter.className}   bg-body  dark:bg-black dark:text-white `}
      >
        <ToastContainer theme="colored" position="top-center" />
        <main className="">{children}</main>
      </body>
    </html>
  );
}
