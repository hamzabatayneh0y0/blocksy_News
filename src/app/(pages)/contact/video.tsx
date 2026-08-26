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
      {/* Video thumbnail */}
      <button
        type="button"
        aria-label="Play video"
        onClick={() => setOpen(true)}
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl"
      >
        <Image
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="Video thumbnail"
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/30">
          <div className="flex size-16 items-center justify-center rounded-full bg-white/80 text-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
            <FaPlay className="ml-1" />
          </div>
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setOpen(false)}
              className="absolute -top-11 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full text-2xl text-white transition-colors hover:bg-white/10 hover:text-primary"
            >
              <IoMdClose />
            </button>

            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
