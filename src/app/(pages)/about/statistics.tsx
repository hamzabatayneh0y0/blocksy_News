"use client";

import { useEffect, useRef, useState } from "react";

export default function Statistics() {
  const [views, setViews] = useState(0);
  const [stories, setStories] = useState(0);
  const [places, setPlaces] = useState(0);

  const R = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!R.current || started) return;

      if (window.scrollY >= R.current.offsetTop - window.innerHeight / 1.2) {
        setStarted(true);

        const interval = setInterval(() => {
          let count = 0;
          setViews((prev) => {
            if (prev >= 400) {
              count++;
              return 400;
            }
            return prev + 4;
          });

          setStories((prev) => {
            if (prev >= 320) {
              count++;
              return 320;
            }
            return prev + 2;
          });
          setPlaces((prev) => {
            if (prev >= 250) {
              count++;
              return 250;
            }
            return prev + 2;
          });

          if (count == 3) {
            clearInterval(interval);
          }
        }, 50);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      ref={R}
      className="statistics flex sm:justify-around gap-10 sm:gap-0 items-center  flex-col sm:flex-row mt-12 relative dark:z-1"
    >
      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{views}K</p>
        <p className="font-light mt-2">Monthly Page Views</p>
      </div>
      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{stories}</p>
        <p className="font-light mt-2">Written Stories</p>
      </div>

      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{places}</p>
        <p className="font-light mt-2">Places Reviewed</p>
      </div>
    </div>
  );
}
