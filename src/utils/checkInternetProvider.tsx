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
    router.push("/no_internet");
  }
}
