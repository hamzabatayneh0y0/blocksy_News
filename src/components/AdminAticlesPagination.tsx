"use client";

import { useRouter } from "next/navigation";

export default function AdminAticlesPagination({
  countArray,
  pageNumber,
}: {
  countArray: number[];
  pageNumber: string;
}) {
  const router = useRouter();
  return (
    <div className="pagination flex justify-center items-center gap-2 mt-12 w-full">
      {pageNumber !== (countArray[countArray.length - 1]?.toString() || "") && (
        <button
          disabled={
            pageNumber == (countArray[countArray.length - 1]?.toString() || "")
          }
          className=" rounded-md cursor-pointer  font-light hover:text-primary duration-300"
          onClick={() => {
            router.push(`/admin/articles?pageNumber=${+pageNumber + 1}`);
          }}
        >
          Next
        </button>
      )}
      {countArray.map((page, i) => {
        return (
          <button
            className={`${pageNumber === (i + 1).toString() ? "text-primary rounded-full bg-white w-8 h-8 border" : ""}   cursor-pointer  font-light   hover:text-primary duration-300`}
            key={i}
            onClick={() => {
              router.push(`/admin/articles?pageNumber=${page}`);
            }}
          >
            {page}
          </button>
        );
      })}
      {pageNumber !== "1" && (
        <button
          className=" rounded-md cursor-pointer  font-light   hover:text-primary duration-300"
          disabled={pageNumber == "1"}
          onClick={() => {
            router.push(`/admin/articles?pageNumber=${+pageNumber - 1}`);
          }}
        >
          prev
        </button>
      )}
    </div>
  );
}
