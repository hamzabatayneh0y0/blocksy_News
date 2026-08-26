"use client";

import Link from "next/link";
import style from "./header.module.css";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LogOutAction } from "@/actions/logOutAction";
import { Session } from "next-auth";
import Image from "next/image";
import { ThemeToggle } from "./Theme";
import { NotificationBell } from "./Notification";

export default function Nav({ session }: { session: Session | null }) {
  const route = useRouter();
  const image = session?.user?.image;

  const optimizedImage = image?.includes("res.cloudinary.com")
    ? image.replace("/upload/", "/upload/q_auto,f_auto/")
    : image ||
      "/images/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.avif";

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  async function handleLogout() {
    const res = await LogOutAction();

    if (res?.ok) {
      route.refresh();
    } else {
      toast.error(res?.message || "Logout failed");
    }
  }
  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* =========================
          Desktop Navigation
      ========================= */}
      <ul
        className="
          hidden
          lg:flex
          items-center
          gap-6
          text-foreground
        "
      >
        <IoClose
          className="
            hidden
            cursor-pointer
            text-2xl
            text-foreground
            transition-colors
            hover:text-primary
          "
          onClick={closeMenu}
        />

        {/* Pages */}
        <li className={`${style.pages} group relative cursor-pointer`}>
          <span
            className="
              capitalize
              text-foreground
              transition-colors
              hover:text-primary
            "
          >
            pages
          </span>

          <div
            className="
              invisible
              absolute
              left-0
                translate-y-2
              top-full
              z-50
              mt-3
              flex
              w-32
              flex-col
              gap-1
              rounded-lg
              border
              border-border
              bg-card
              p-2
              opacity-0
              shadow-lg
              transition-all
              duration-300
              group-hover:visible
              group-hover:opacity-100
              group-hover:translate-y-0
            "
          >
            <Link
              href="/articles?pageNumber=1"
              className="
                rounded-md
                px-3
                py-2
                text-sm
                text-card-foreground
                transition-colors
                hover:bg-accent
                hover:text-accent-foreground
              "
            >
              articles
            </Link>

            {session?.user?.isAdmin && (
              <Link
                href="/admin"
                className="
                  rounded-md
                  px-3
                  py-2
                  text-sm
                  text-card-foreground
                  transition-colors
                  hover:bg-accent
                  hover:text-accent-foreground
                "
              >
                admin
              </Link>
            )}
          </div>
        </li>

        {/* About */}
        <li className="cursor-pointer capitalize">
          <Link
            href="/about"
            className="
              text-foreground
              transition-colors
              hover:text-primary
            "
          >
            about us
          </Link>
        </li>

        {/* Contact */}
        <li className="cursor-pointer capitalize">
          <Link
            href="/contact"
            className="
              rounded-md
              bg-primary
              px-3
              py-1.5
              text-sm
              font-medium
              text-primary-foreground
              shadow-sm
              transition-all
              hover:opacity-90
            "
          >
            contact us
          </Link>
        </li>

        {/* User */}
        <li className="flex   items-center gap-2">
          {session?.user?.id && <NotificationBell navOpen={false} />}

          {session?.user ? (
            <div className="group relative cursor-pointer pb-1">
              <div
                className="
                  relative
                  h-10
                  w-10
                  overflow-hidden
                  rounded-full
                  border
                  border-border
                  bg-muted
                "
              >
                <Image
                  src={optimizedImage}
                  alt="avatar"
                  fill
                  className="object-cover object-center"
                  sizes="100px"
                />
              </div>

              {/* User Dropdown */}
              <div
                className="
                  invisible
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-2
                  w-44
                  translate-y-2
                  rounded-xl
                  border
                  border-border
                  bg-card
                  p-2
                  opacity-0
                  shadow-lg
                  transition-all
                  duration-300
                  ease-out
                  group-hover:visible
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <Link
                  href={`/profile`}
                  className="
                    flex
                    items-center
                    rounded-md
                    border-b
                    border-border
                    px-3
                    py-2
                    text-sm
                    my-1
                    text-card-foreground
                    transition-colors
                    hover:bg-accent
                    hover:text-accent-foreground
                  "
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    my-1
                    cursor-pointer
                    items-center
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-sm
                    text-destructive
                    transition-colors
                    hover:bg-destructive/10
                  "
                >
                  Logout
                </button>
                <div
                  className="
                   flex
                    items-center
                    rounded-md
                    border-b
                    border-border
                    px-3
                    py-2
                    text-sm
                    text-card-foreground
                    transition-colors
                    hover:bg-accent
                    hover:text-accent-foreground
                  "
                >
                  <ThemeToggle />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-sm">
              <Link
                href="/login"
                className="
                  text-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                login
              </Link>

              <span className="mx-1.5 text-muted-foreground">/</span>

              <Link
                href="/register"
                className="
                  text-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                register
              </Link>
            </div>
          )}
        </li>
      </ul>

      {/* =========================
          Mobile Menu Trigger
      ========================= */}
      <input
        type="checkbox"
        className={`hidden ${style.inp}`}
        id="burger"
        checked={open}
        onChange={() => setOpen(!open)}
      />

      <label
        htmlFor="burger"
        className={`${style.burger} cursor-pointer lg:hidden`}
      >
        <span className={`cursor-pointer ${style.bar}`} />
        <span className={`cursor-pointer ${style.bar}`} />
        <span className={`cursor-pointer ${style.bar}`} />
      </label>

      {/* =========================
          Mobile Overlay
      ========================= */}
      <div
        className={`
          fixed
          inset-0
          z-40
          bg-background/60
          backdrop-blur-sm
          transition-opacity
          duration-300
          lg:hidden
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        onClick={closeMenu}
      />

      {/* =========================
          Mobile Navigation
      ========================= */}
      <ul
        className={`
          fixed
          right-0
          top-0
          z-50
          flex
          h-screen
          w-72
          max-w-[85vw]
          flex-col
          gap-6
          border-l
          border-border
          bg-card
          px-5
          py-5
          text-card-foreground
          shadow-2xl
          transition-transform
          duration-300
          lg:hidden
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close */}
        <li className="flex justify-between items-center ">
          <div className="flex gap-2">
            {session?.user && (
              <div className="flex h-8 w-8 items-center justify-center">
                <NotificationBell navOpen={open} />
              </div>
            )}
            <div className="w-8 h-8">
              <ThemeToggle />
            </div>
          </div>
          <div className="">
            <IoClose
              className="
              cursor-pointer
              text-2xl
              text-muted-foreground
              transition-colors
              hover:text-primary
            "
              onClick={closeMenu}
            />
          </div>
        </li>

        {/* Pages */}
        <li className={`${style.pages} relative `}>
          <span
            className="
              capitalize
              text-card-foreground
              transition-colors
              hover:text-primary
            "
          >
            pages
          </span>

          <div className="mt-3 flex flex-col gap-1 border-l border-border pl-3">
            <Link
              onClick={closeMenu}
              href="/articles?pageNumber=1"
              className="
                rounded-md
                px-3
                py-2
                text-sm
                text-muted-foreground
                transition-colors
                hover:bg-accent
                hover:text-accent-foreground
              "
            >
              articles
            </Link>

            {session?.user?.isAdmin && (
              <>
                <Link
                  onClick={closeMenu}
                  href="/admin"
                  className="
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    text-muted-foreground
                    transition-colors
                    hover:bg-accent
                    hover:text-accent-foreground
                  "
                >
                  admin
                </Link>
              </>
            )}
          </div>
        </li>

        {/* About */}
        <li className="cursor-pointer capitalize">
          <Link
            onClick={closeMenu}
            href="/about"
            className="
              text-card-foreground
              transition-colors
              hover:text-primary
            "
          >
            about us
          </Link>
        </li>

        {/* Contact */}
        <li className="cursor-pointer capitalize">
          <Link
            onClick={closeMenu}
            href="/contact"
            className="
              inline-flex
              rounded-md
              bg-primary
              px-4
              py-2
              text-sm
              font-medium
              text-primary-foreground
              shadow-sm
              transition-all
              hover:opacity-90
            "
          >
            contact us
          </Link>
        </li>

        {/* User */}
        <li className="flex w-full capitalize">
          {session?.user ? (
            <div className="group relative w-full cursor-pointer">
              <div
                className="
                  relative
                  h-10
                  w-10
                  overflow-hidden
                  rounded-full
                  border
                  border-border
                  bg-muted
                "
              >
                <Image
                  src={optimizedImage}
                  alt="avatar"
                  fill
                  className="object-cover object-center"
                  sizes="100px"
                />
              </div>

              <div
                className="
                  max-h-0
                  overflow-hidden
                  px-0
                  opacity-0
                  transition-all
                  duration-300
                  ease-out
                  group-hover:max-h-40
                  group-hover:py-3
                  group-hover:opacity-100
                "
              >
                <Link
                  href={`/profile`}
                  className="
                    block
                    border-b
                    border-border
                    py-2
                    text-sm
                    text-card-foreground
                    transition-colors
                    hover:border-primary
                    hover:text-primary
                  "
                  onClick={closeMenu}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    block
                    w-full
                    cursor-pointer
                    border-b
                    border-border
                    py-2
                    text-left
                    text-sm
                    text-destructive
                    transition-colors
                    hover:border-destructive
                  "
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-sm">
              <Link
                onClick={closeMenu}
                href="/login"
                className="
                  text-card-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                login
              </Link>

              <span className="mx-1.5 text-muted-foreground">/</span>

              <Link
                onClick={closeMenu}
                href="/register"
                className="
                  text-card-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                register
              </Link>
            </div>
          )}
        </li>
      </ul>
    </>
  );
}
