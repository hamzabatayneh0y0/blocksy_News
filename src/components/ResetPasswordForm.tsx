"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { resetPasswordSchema } from "@/utils/validationSchemas";
import { resetPsswordAction } from "@/actions/resetPsswordAction";
import { toast } from "react-toastify";
import { MorphingInfinity } from "./morphing-infinity";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function ResetPasswordForm({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [seepass, setSeepass] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const validation = resetPasswordSchema.safeParse({ password });

      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }

      const data = await resetPsswordAction(password, email);

      if (data.success) {
        setSuccess(true);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center animate-pop">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <div>
            <CheckCircle className="mx-auto h-20 w-20 text-green-600" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-green-600">
            Password Changed!
          </h1>

          <p className="mt-2 text-gray-600">
            Your password has been updated successfully.
          </p>
          <Link className="text-primary text-center" href={"/login"}>
            go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl  flex flex-col gap-3   p-8 shadow"
      >
        <h1 className="text-center text-2xl font-bold">Reset Password</h1>
        <div className="flex gap-1 items-center border border-black inset-shadow-2xs px-2 py-3 rounded-md dark:bg-black dark:inset-shadow-white ">
          <input
            type={seepass ? "text" : "password"}
            placeholder="New password"
            name="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
            className="w-full"
            required
          />
          {seepass ? (
            <FaRegEye
              onClick={() => {
                setSeepass(!seepass);
              }}
              className="cursor-pointer"
            />
          ) : (
            <FaRegEyeSlash
              onClick={() => {
                setSeepass(!seepass);
              }}
              className="cursor-pointer"
            />
          )}
        </div>
        <button
          disabled={Loading}
          className={`${Loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}} w-fit bg-primary text-white cursor-pointer rounded-md m-auto px-3 py-1 hover:bg-primary/80 duration-300 `}
        >
          {Loading ? (
            <>
              <MorphingInfinity className="size-10 " />
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
}
