"use client";

import { useState } from "react";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function RegesterForm() {
  const [Regester, setRegester] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [Loading, setLoading] = useState(false);
  const [seepass, setSeepass] = useState(false);

  const route = useRouter();
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setRegester((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${DOMAIN}/api/users/register`, Regester);
      setLoading(false);
      route.push("/");
    } catch (err: any) {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message);
      setLoading(false);
    }
  }
  return (
    <form className="LoginForm flex flex-col gap-5" onSubmit={handleSubmit}>
      <p className="text-3xl font-bold">Regenster</p>
      <input
        required
        type="text"
        name="username"
        placeholder="your name"
        onChange={handleOnChange}
        className="border border-black inset-shadow-2xs px-2 py-3 rounded-md dark:bg-black dark:inset-shadow-white"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="your email"
        onChange={handleOnChange}
        className="border border-black inset-shadow-2xs px-2 py-3 rounded-md dark:bg-black dark:inset-shadow-white"
      />
      <div className="flex gap-1 items-center">
        <input
          type={seepass ? "text" : "password"}
          name="password"
          placeholder="your password"
          onChange={handleOnChange}
          className="border border-black inset-shadow-2xs px-2 py-3 rounded-md dark:bg-black dark:inset-shadow-white w-full"
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
        type="submit"
        className="w-fit bg-primary text-white cursor-pointer rounded-md m-auto px-3 py-1"
      >
        {Loading ? (
          <>
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-neutral-tertiary animate-spin fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </>
        ) : (
          "Regenster"
        )}
      </button>
      <Link className="text-primary text-center" href={"/login"}>
        you already have an account? go to login
      </Link>
    </form>
  );
}
