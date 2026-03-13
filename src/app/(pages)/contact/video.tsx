"use client";

import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
export default function Video() {
  const [open, setOpen] = useState(false);
  const videoId = "eLTfGT-_vKE";

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
        <Image
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="video thumbnail"
          className="rounded-lg w-full"
          width={300}
          height={300}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/60 p-4 rounded-full">
            <FaPlay />
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => {
            setOpen(false);
          }}
        >
          <div className="relative w-[90%] max-w-3xl">
            <button
              className="absolute -top-10 right-0 text-white text-xl cursor-pointer hover:text-primary duration-300"
              onClick={() => setOpen(false)}
            >
              <IoMdClose />
            </button>

            <iframe
              className="w-full aspect-video rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
