import getProfile from "@/apiCalls/profile";
import { Article, ArticleLike, Bookmark, Comment } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import Theme from "@/components/Theme";
import Tabs from "./tabs";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile",
  description: "Manage your account and view your activity.",
  robots: {
    index: false,
    follow: false,
  },
};

type profileprop = {
  params: Promise<{ id: string }>;
};

type usertype = {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
  createdAt: Date;
  comments: Comment[];
  articleLikes: (ArticleLike & { article: Article })[];
  bookmarks: (Bookmark & { article: Article })[];
};

export default async function Profile({ params }: profileprop) {
  const { id } = await params;
  const token = (await cookies()).get("jwtToken")?.value || "";
  const currentuser = verifyTokenForPage(token);
  if (id !== currentuser?.id.toString()) redirect("/");
  const user = (await getProfile(id)) as usertype;

  return (
    <div className="px-5 py-12">
      <h1 className="text-center text-3xl sm:text-6xl font-bold capitalize duration-300">
        Hey {user.username}
      </h1>

      <div className="flex flex-col gap-5">
        <div className="info flex flex-col gap-3 bg-white shadow-md p-5 border rounded-md mt-12 dark:bg-black dark:shadow-white">
          <h2 className=" text-3xl font-bold capitalize mb-4">Info</h2>
          <div className="flex flex-wrap gap-2 items-center">
            {" "}
            <h3 className=" text-2xl font-medium capitalize">user name : </h3>
            <p className="capitalize text-2xl">{user.username}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <h3 className=" text-2xl font-medium capitalize">email : </h3>
            <p className="text-2xl">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <h3 className=" text-2xl font-medium capitalize">joined : </h3>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <Tabs user={user} />
        {user.id === currentuser?.id && <Theme />}
      </div>
    </div>
  );
}
