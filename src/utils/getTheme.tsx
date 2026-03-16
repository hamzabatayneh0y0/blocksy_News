"use server";

import { cookies } from "next/headers";

export default async function getTheme() {
  const theme = (await cookies()).get("dark")?.value || "";
  return theme === "true";
}
