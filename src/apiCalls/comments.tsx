"use server";

import { DOMAIN } from "@/utils/constants";
import { cookies } from "next/headers";

export async function getComments() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("jwtToken")?.value;

  const data = await fetch(`${DOMAIN}/api/comments`, {
    headers: {
      Cookie: `jwtToken=${token}`,
    },
    cache: "no-store",
  });
  if (!data.ok) {
    throw new Error("falied to fetch comments");
  }
  return data.json();
}
