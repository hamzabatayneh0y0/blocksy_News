"use client";
import Link from "next/link";
import style from "./header.module.css";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { JwtPayload } from "jsonwebtoken";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function Nav({ payload }: { payload: JwtPayload | null }) {
  const route = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleLogout() {
    try {
      await axios.get(`${DOMAIN}/api/users/logout`);
      route.refresh();
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  }
  return (
    <>
      <ul className={`hidden lg:flex  lg:flex-row lg:gap-5 duration-300  `}>
        <IoClose
          className="lg:hidden text-primary cursor-pointer text-2xl hover:text-white duration-300"
          onClick={() => {
            setOpen(false);
          }}
        />
        <li className={`${style.pages} not-lg:mt-12`}>
          <span className=" hover:text-primary duration-300">pages</span>
          <div className="flex flex-col gap-5 py-3 px-2 rounded-md lg:absolute lg:bg-white shadow-md  lg:left-0 lg:top-25 lg:duration-300 lg:invisible lg:w-25 lg:dark:bg-black dark:shadow-white">
            <Link
              className="border-b py-2 hover:text-primary duration-300"
              href={"/articles?pageNumber=1"}
            >
              articles
            </Link>
            {payload?.isAdmin && (
              <Link
                className="border-b py-2 hover:text-primary duration-300"
                href={"/admin"}
              >
                admin
              </Link>
            )}
          </div>
        </li>
        <li className="capitalize hover:text-primary duration-300 cursor-pointer">
          <Link href={"/about"}>about us</Link>
        </li>
        <li className="capitalize hover:text-primary duration-300 cursor-pointer">
          <Link
            className="bg-primary px-3 py-1 rounded-sm text-white"
            href={"/contact"}
          >
            contact us
          </Link>
        </li>
        <li className="capitalize">
          {payload ? (
            <>
              <Link
                className=" hover:text-primary duration-300 cursor-pointer font-bold"
                href={`/profile/${payload?.id}`}
              >
                {payload?.username}
              </Link>
              <span className="mx-1">/</span>
              <Link
                onClick={handleLogout}
                className=" hover:text-primary duration-300 cursor-pointer  ms-1"
                href={""}
              >
                logout
              </Link>
            </>
          ) : (
            <>
              <Link
                className=" hover:text-primary duration-300 cursor-pointer"
                href={"/login"}
              >
                login
              </Link>
              <span className="mx-1">/</span>
              <Link
                className=" hover:text-primary duration-300 cursor-pointer"
                href={"/register"}
              >
                register
              </Link>
            </>
          )}
        </li>
      </ul>
      <input
        type="checkbox"
        className={`hidden ${style.inp}`}
        id="burger"
        checked={open}
        onChange={() => {
          setOpen(!open);
        }}
      />
      <label htmlFor="burger" className={`${style.burger} lg:hidden`}>
        <span className={style.bar}></span>
        <span className={style.bar}></span>
        <span className={style.bar}></span>
      </label>
      <div
        className={`not-lg:fixed not-lg:top-0 not-lg:left-0 not-lg:w-full not-lg:h-full ${open ? "" : "hidden"} `}
        onClick={() => {
          setOpen(false);
        }}
      ></div>

      <ul
        className={` flex lg:hidden flex-col gap-8 bg-black/90 text-white not-lg:px-3  not-lg:py-5  not-lg:fixed not-lg:top-0 not-lg:-right-75 duration-300 not-lg:h-screen w-50 sm:w-75 not-lg:z-50 ${open ? "not-lg:-translate-x-75 shadow-2xl dark:shadow-white" : ""} `}
      >
        <IoClose
          className="lg:hidden text-white cursor-pointer text-2xl hover:text-primary duration-300"
          onClick={() => {
            setOpen(false);
          }}
        />
        <li className={`${style.pages} not-lg:mt-12`}>
          <span className=" hover:text-primary duration-300">pages</span>
          <div className="flex flex-col gap-5 py-3 px-2 rounded-md lg:absolute lg:bg-white shadow-md lg:left-0 lg:top-25 lg:duration-300 lg:invisible lg:w-25">
            <Link
              onClick={() => {
                setOpen(false);
              }}
              className="border-b py-2 hover:text-primary duration-300"
              href={"/articles?pageNumber=1"}
            >
              articles
            </Link>
            {payload?.isAdmin && (
              <>
                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="border-b py-2 hover:text-primary duration-300"
                  href={"/admin"}
                >
                  admin
                </Link>

                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="border-b py-2 hover:text-primary duration-300"
                  href={"/admin/articles?pageNumber=1"}
                >
                  admine articles
                </Link>

                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="border-b py-2 hover:text-primary duration-300"
                  href={"/admin/comments"}
                >
                  comments
                </Link>
              </>
            )}
          </div>
        </li>
        <li className="capitalize hover:text-primary duration-300 cursor-pointer">
          <Link
            onClick={() => {
              setOpen(false);
            }}
            href={"/about"}
          >
            about us
          </Link>
        </li>
        <li className="capitalize hover:text-primary duration-300 cursor-pointer">
          <Link
            onClick={() => {
              setOpen(false);
            }}
            className="bg-primary px-3 py-1 rounded-sm text-white"
            href={"/contact"}
          >
            contact us
          </Link>
        </li>
        <li className="capitalize">
          {payload ? (
            <>
              <Link
                onClick={() => {
                  setOpen(false);
                }}
                className=" hover:text-primary duration-300 cursor-pointer font-bold"
                href={`/profile/${payload?.id}`}
              >
                {payload?.username}
              </Link>
              <span className="mx-1">/</span>
              <Link
                onClick={async () => {
                  handleLogout();
                  setOpen(false);
                }}
                className=" hover:text-primary duration-300 cursor-pointer  ms-1"
                href={""}
              >
                logout
              </Link>
            </>
          ) : (
            <>
              <Link
                onClick={() => {
                  setOpen(false);
                }}
                className=" hover:text-primary duration-300 cursor-pointer"
                href={"/login"}
              >
                login
              </Link>
              <span className="mx-1">/</span>
              <Link
                onClick={() => {
                  setOpen(false);
                }}
                className=" hover:text-primary duration-300 cursor-pointer"
                href={"/register"}
              >
                register
              </Link>
            </>
          )}
        </li>
      </ul>
    </>
  );
}
