import { cookies } from "next/headers";
import Nav from "./nav";
import { verifyTokenForPage } from "@/utils/verifyToken";
import Link from "next/link";

export default async function Header() {
  const token = (await cookies()).get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);
  return (
    <div className="p-5 flex items-center justify-between bg-white dark:bg-black shadow-md dark:shadow-white ">
      <h2 className="text-3xl">
        <Link href={"/"}>
          Blocksy <span className="text-primary ">News</span>
        </Link>
      </h2>
      <Nav payload={payload} />
    </div>
  );
}
