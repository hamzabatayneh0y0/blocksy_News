"use client";
import Link from "next/link";
import { useState } from "react";
import style from "./adminSidebar.module.css";
import { JWTPayload } from "@/utils/types";
export default function AdminSidebar({ payload }: { payload: JWTPayload }) {
  const [openSideBar, setOpenSideBar] = useState(false);
  const listyle =
    "duration-300  sm:w-full capitalize font-bold hover:text-primary cursor-pointer border-b-1 pb-2";
  return (
    <div
      className={`dark:bg-black  shrink-0  ${openSideBar ? "not-sm:w-60" : "not-sm:w-8 "}  bg-white overflow-hidden shadow-xl sm:w-75 flex p-1 flex-col duration-300 relative `}
    >
      <div className="sm:hidden">
        <input
          type="checkbox"
          className="hidden "
          id="sideburger"
          checked={openSideBar}
          onChange={() => {
            setOpenSideBar(!openSideBar);
          }}
        />
        <label
          htmlFor="sideburger"
          className={`sideburger ${style.sideburger}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>

      <ul
        className={`links flex flex-col gap-4 ${openSideBar ? "not-sm:w-full p-3" : "not-sm:w-0 "} not-sm:text-sm overflow-hidden duration-300 sm:p-5 transition-all`}
      >
        <li className={`${listyle} `}>
          <Link
            onClick={() => {
              setOpenSideBar(false);
            }}
            href={"/admin"}
          >
            admin
          </Link>
        </li>
        <li className={`${listyle} `}>
          <Link
            onClick={() => {
              setOpenSideBar(false);
            }}
            href={"/admin/articles?pageNumber=1"}
          >
            articles
          </Link>
        </li>
        <li className={`${listyle}`}>
          <Link
            onClick={() => {
              setOpenSideBar(false);
            }}
            href={"/admin/comments"}
          >
            comments
          </Link>
        </li>
      </ul>
    </div>
  );
}
