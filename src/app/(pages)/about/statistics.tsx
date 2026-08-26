"use client";

import { useEffect, useRef, useState } from "react";

export default function Statistics() {
  const [views, setViews] = useState(0);
  const [stories, setStories] = useState(0);
  const [places, setPlaces] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setStarted(true);
        observer.disconnect();

        const interval = setInterval(() => {
          let finished = 0;

          setViews((prev) => {
            if (prev >= 400) {
              finished++;
              return 400;
            }

            return Math.min(prev + 10, 400);
          });

          setStories((prev) => {
            if (prev >= 320) {
              finished++;
              return 320;
            }

            return Math.min(prev + 8, 320);
          });

          setPlaces((prev) => {
            if (prev >= 250) {
              finished++;
              return 250;
            }

            return Math.min(prev + 6, 250);
          });

          if (finished === 3) {
            clearInterval(interval);
          }
        }, 50);
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [started]);

  return (
    <div
      ref={ref}
      className="statistics relative mt-12 flex flex-col items-center gap-10 sm:flex-row sm:justify-around sm:gap-0 dark:z-[1]"
    >
      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{views}K</p>
        <p className="mt-2 font-light">Monthly Page Views</p>
      </div>

      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{stories}</p>
        <p className="mt-2 font-light">Written Stories</p>
      </div>

      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{places}</p>
        <p className="mt-2 font-light">Places Reviewed</p>
      </div>
    </div>
  );
}
