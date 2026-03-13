"use client";
import { DOMAIN } from "@/utils/constants";
import { CommentWithUser } from "@/utils/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
type CommentFormResult = {
  text: string;
};

type CommentProps = {
  comment: CommentWithUser;
  userId: string | undefined;
};
export default function Comment({ comment, userId }: CommentProps) {
  const [like, setLike] = useState(false);

  let text: HTMLInputElement;
  const router = useRouter();
  const update = () => {
    Swal.fire<CommentFormResult>({
      title: "write a comment",
      html: `
    <input type="text" id="text" class="p-3 border rounded-md inset-shadow-2xs shadow-black bg-white w-full" placeholder="comment" value=${comment.text}>
  `,
      confirmButtonText: "update",
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer",
      },
      buttonsStyling: false,
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;

        text = popup.querySelector("#text") as HTMLInputElement;

        text.onkeyup = (event) => event.key === "Enter" && Swal.clickConfirm();
      },
      preConfirm: () => {
        const comment = text.value;
        if (!comment) {
          Swal.showValidationMessage(`Please enter comment`);
        }
        return { text: text.value };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updateComment = async () => {
          try {
            console.log(result.value?.text);
            await axios.put(`${DOMAIN}/api/comments/${comment.id}`, {
              text: result.value?.text,
            });
            router.refresh();
          } catch (err: any) {
            console.log(err.response?.data?.message);
            toast.error(err.response?.data?.message);
            return;
          }
        };
        updateComment();
      }
    });
  };
  const delet = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer ml-2",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteComment = async () => {
          try {
            await axios.delete(`${DOMAIN}/api/comments/${comment.id}`);
            router.refresh();
          } catch (err: any) {
            console.log(err.response?.data?.message);
            toast.error(err.response?.data?.message);
            return;
          }
        };
        deleteComment();
        Swal.fire({
          title: "Deleted!",
          text: "Your comment has been deleted.",
          icon: "success",
          customClass: {
            confirmButton:
              "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer",
            cancelButton:
              "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer ml-2",
          },
          buttonsStyling: false,
        });
      }
    });
  };

  const isliked = comment.likes?.some(
    (like: any) => like.userId.toString() === userId,
  );
  async function handleLike() {
    try {
      await axios.post(`${DOMAIN}/api/comments/${comment.id}/like`);
      router.refresh();
    } catch (err: any) {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message);
    }
  }

  return (
    <div className="p-5 border rounded-md bg-white dark:bg-black  shadow-2xl ">
      <span className="block text-right">
        {new Date(comment.createdAt).toLocaleDateString()}
      </span>
      <h3 className="font-bold text-2xl capitalize">{comment.user.username}</h3>
      <p className="my-2">{comment.text}</p>

      <div className="my-2 flex gap-1 items-center justify-end">
        <span>{comment.likes.length}</span>
        <AiOutlineLike
          className={` text-2xl sm:text-3xl cursor-pointer duration-300  ${isliked ? "text-primary" : ""} ${like ? "scale-125 pointer-events-none" : "scale-100"}`}
          onClick={() => {
            handleLike();
            setLike(!like);
            setTimeout(() => setLike(false), 303);
          }}
        />
      </div>

      {userId && userId === comment.userId.toString() && (
        <div className="change flex gap-2 justify-end items-center w-full">
          <GoPencil
            className="text-green-600 cursor-pointer "
            onClick={update}
          />
          <FaRegTrashAlt
            className="text-red-600  cursor-pointer"
            onClick={delet}
          />
        </div>
      )}
    </div>
  );
}
