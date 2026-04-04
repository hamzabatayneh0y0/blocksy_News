"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckInternetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [Online, setOnline] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
    };
    const handleOffline = () => {
      setOnline(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  if (Online) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex items-center justify-center p-5 min-h-screen">
        <h1 className="text-2xl sm:text-4xl text-center">
          failed to load data , please check your internet connection and try
          again
        </h1>
      </div>
    );
  }
}
