"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { MorphingInfinity } from "@/components/morphing-infinity";
import { loginSchema } from "@/utils/validationSchemas";
import SocialProviders from "@/components/SocialProviders";
import { loginAction } from "@/actions/loginAction";

export default function LoginForm() {
  const [LogIn, setLogIn] = useState({ email: "", password: "" });
  const [Loading, setLoading] = useState({ value: false, provider: false });
  const [seepass, setSeepass] = useState(false);
  const route = useRouter();
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLogIn((prev) => ({ ...prev, [name]: value.replace(/\s/g, "") }));
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading((prev) => {
        return { ...prev, value: true };
      });
      const validation = loginSchema.safeParse(LogIn);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setLoading((prev) => {
          return { ...prev, value: false };
        });
        return;
      }

      const res = await loginAction(LogIn.email, LogIn.password);
      setLoading((prev) => {
        return { ...prev, value: false };
      });
      if (res.ok) {
        route.replace("/");
      } else {
        toast.info(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "something went wrong");
      setLoading((prev) => {
        return { ...prev, value: false };
      });
    }
  }

  return (
    <form className="LoginForm flex flex-col gap-5" onSubmit={handleSubmit}>
      <p className="text-2xl sm:text-3xl font-bold text-center">
        Sign in to your account
      </p>

      <input
        disabled={Loading.value}
        type="text"
        name="email"
        value={LogIn.email}
        maxLength={200}
        placeholder="your email"
        onChange={handleOnChange}
        className="border border-black inset-shadow-2xs px-2 py-3 rounded-md dark:bg-black dark:inset-shadow-white"
      />
      <div className="flex gap-1 items-center border border-black inset-shadow-2xs px-2 py-3 rounded-md dark:bg-black dark:inset-shadow-white ">
        <input
          disabled={Loading.value}
          type={seepass ? "text" : "password"}
          name="password"
          placeholder="your password"
          value={LogIn.password}
          onChange={handleOnChange}
          className="w-full"
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
        type="submit"
        disabled={Loading.value}
        className={`${Loading.value ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}} w-fit bg-primary text-white cursor-pointer rounded-md m-auto px-3 py-1 hover:bg-primary/80 duration-300 `}
      >
        {!Loading.provider && Loading.value ? (
          <>
            <MorphingInfinity className="size-10 " />
          </>
        ) : (
          "Login"
        )}
      </button>
      <SocialProviders Loading={Loading} setLoading={setLoading} />
      <Link className="text-primary text-center" href={"/register"}>
        you do not have an account? click here to create one
      </Link>
      <Link className="text-primary text-center" href={"/auth/forgot-password"}>
        forgot your password?
      </Link>
    </form>
  );
}
