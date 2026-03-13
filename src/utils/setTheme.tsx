"use server";

import { cookies } from "next/headers";

export default async function setTheme(dark: boolean) {
  (await cookies()).set("dark", `${dark}`, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
