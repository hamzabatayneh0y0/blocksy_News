"use client";

import setTheme from "@/utils/setTheme";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Theme() {
  const router = useRouter();
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark") ? true : false,
  );
  return (
    <div className="theme">
      <h2 className=" text-3xl font-bold capitalize mb-4">Theme</h2>

      <button
        className={`w-25 h-8 bg-gray-100 rounded-full shadow-md p-1 relative  ${dark ? "bg-primary" : ""} duration-300`}
      >
        <div
          onClick={() => {
            const newTheme = !dark;
            setDark(newTheme);
            setTheme(newTheme);
            router.refresh();
          }}
          className={`shadow-md bg-white absolute w-6 h-6 top-1/2  -translate-y-1/2 rounded-full duration-300 cursor-pointer ${dark ? "translate-17" : ""}`}
        ></div>
      </button>
    </div>
  );
}
