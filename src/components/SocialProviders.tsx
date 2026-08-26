import { signIn } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MorphingInfinity } from "./morphing-infinity";
import { toast } from "react-toastify";

export default function SocialProviders({
  Loading,
  setLoading,
}: {
  Loading: { value: boolean; provider: boolean };
  setLoading: Dispatch<SetStateAction<{ value: boolean; provider: boolean }>>;
}) {
  const [githubLoading, githubsetLoading] = useState(false);
  const [googleLoading, googlesetLoading] = useState(false);

  async function handleProvider(provider: "github" | "google") {
    try {
      setLoading({ value: true, provider: true });
      if (provider === "github") {
        githubsetLoading(true);
      } else googlesetLoading(true);
      const result = await signIn(provider, { redirectTo: "/" });
    } catch (err: any) {
      console.log("SocialProviders-Error", err);
      toast.error(err.message || "something went wrong");
    } finally {
      googlesetLoading(false);
      githubsetLoading(false);
      setLoading({ value: false, provider: true });
    }
  }

  const disabled = googleLoading || githubLoading || Loading.value;
  return (
    <div className="flex gap-5 justify-center items-center not-sm:flex-col">
      <div
        onClick={() => {
          if (disabled) return;
          handleProvider("google");
        }}
        className={`
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        px-6 py-2 bg-blue-200 hover:bg-blue-300  rounded flex justify-center w-full duration-300 `}
      >
        {googleLoading ? (
          <>
            <MorphingInfinity className="size-10 text-primary" />
          </>
        ) : (
          <FcGoogle className="text-4xl " />
        )}
      </div>
      <div
        onClick={() => {
          if (disabled) return;
          handleProvider("github");
        }}
        className={`
           ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
   px-6 py-2 bg-blue-200 hover:bg-blue-300  rounded  flex justify-center w-full duration-300`}
      >
        {githubLoading ? (
          <>
            <MorphingInfinity className="size-10 text-primary " />
          </>
        ) : (
          <FaGithub className="text-4xl " />
        )}
      </div>
    </div>
  );
}
