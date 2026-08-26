import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { cookies } from "next/headers";
import CheckInternetProvider from "@/utils/checkInternetProvider";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import ResactQueryProvider from "@/utils/QueryClientProvider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DOMAIN } from "@/utils/constants";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  metadataBase: new URL(`${DOMAIN}`),

  title: {
    default: "Blocksy News",
    template: "%s | Blocksy News",
  },

  description: "your way to now",
  icons: ["/Gemini_Generated_Image_kcgvq9kcgvq9kcgv.svg"],
  openGraph: {
    images: ["/og-image.jpeg"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const dark = (await cookies()).get("dark")?.value;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(dark === "true" ? "dark" : "")}
    >
      <body
        className={`${manrope.className}  bg-body  dark:bg-black dark:text-white `}
      >
        <ThemeProvider>
          <SessionProvider>
            <ToastContainer theme="colored" position="top-center" />
            <main className="">
              <CheckInternetProvider>
                <ResactQueryProvider>{children}</ResactQueryProvider>
              </CheckInternetProvider>
            </main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
