import { DOMAIN } from "@/utils/constants";
import { cookies } from "next/headers";

export default async function getProfile(id: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("jwtToken")?.value;

  const res = await fetch(`${DOMAIN}/api/users/profile/${id}`, {
    headers: {
      Cookie: `jwtToken=${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    console.log(res);
    throw Error("failde to fetch profile");
  }
  return res.json();
}
