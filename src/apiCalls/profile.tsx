import { DOMAIN } from "@/utils/constants";
import { console } from "inspector";
import { cookies } from "next/headers";

export default async function getProfile(id: string) {
  const cookieStore = await cookies();
  const res = await fetch(`${DOMAIN}/api/users/profile/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },

    next: {
      revalidate: 60 * 60,
      tags: [`user-profile-${id}`],
    },
  });
  if (!res.ok) {
    throw Error("failde to fetch profile");
  }
  return res.json();
}
export async function getForYouArticles(id: string) {
  console.log("foryou");
  const data = await fetch(`${DOMAIN}/api/users/profile/${id}/forYou`, {
    next: {
      revalidate: 60 * 60,
      tags: ["articles", `user-foryou-${id}`],
    },
  });

  if (!data.ok) {
    console.error("falied to fetch ForYou articles");
    return [];
  }

  return data.json();
}
