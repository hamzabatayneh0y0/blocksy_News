import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ProfileInfo from "@/components/ProfileInfo";
import ProfileTabs from "@/components/ProfileTabs";
import getProfile from "@/apiCalls/profile";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  if (Number.isNaN(userId)) {
    redirect("/login");
  }

  const user = await getProfile(userId.toString());

  return (
    <main className="mx-auto w-full   py-12">
      <div className="space-y-6">
        <ProfileInfo user={user} />

        <ProfileTabs userId={user.id} />
      </div>
    </main>
  );
}
