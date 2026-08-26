import Nav from "./nav";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();
  return (
    <div className="p-5 flex items-center  justify-between bg-white dark:bg-black shadow-md dark:shadow-white ">
      <h2 className="text-3xl">
        <Link href={"/"}>
          Blocksy <span className="text-primary ">News</span>
        </Link>
      </h2>
      <Nav session={session} />
    </div>
  );
}
