"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error flex flex-col justify-center items-center h-screen">
      <h2 className="text-3xl md:text-7xl text-center font-bold uppercase mb-10">
        something went wrong,please try again later
      </h2>
      <button
        onClick={() => reset()}
        className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
