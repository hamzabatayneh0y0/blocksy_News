"use client";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
export default function CommentForm({ id }: { id: number }) {
  const [comment, setComment] = useState("");
  const router = useRouter();

  async function Submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (comment == "") {
      toast.error("please write something");
      return;
    }
    try {
      await axios.post(`${DOMAIN}/api/comments`, {
        text: comment,
        articleId: id,
      });
      setComment("");
      router.refresh();
    } catch (err: any) {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message);
    }
  }
  return (
    <form
      onSubmit={Submit}
      className="flex gap-2 flex-col sm:flex-row sm:justify-between"
    >
      <input
        type="text"
        name="comment"
        placeholder="comment"
        value={comment}
        className="p-3 border rounded-md inset-shadow-2xs shadow-black bg-white w-full dark:bg-black dark:inset-shadow-white"
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <button
        type="submit"
        className="bg-primary text-white  font-light rounded-md p-2 capitalize block mt-2 w-fit hover:text-primary hover:bg-white duration-300 cursor-pointer shadow-xl "
      >
        comment
      </button>
    </form>
  );
}
