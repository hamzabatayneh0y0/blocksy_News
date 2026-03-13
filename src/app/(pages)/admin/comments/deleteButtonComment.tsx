"use client";

import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function DeleteButtonComment({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
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
                await axios.delete(`${DOMAIN}/api/comments/${id}`);
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
      }}
      className="bg-red-500 w-full text-white text-center font-bold rounded-md p-1 capitalize m-auto block  hover:text-red-500 hover:bg-white duration-300 cursor-pointer shadow-xl "
    >
      Delete
    </button>
  );
}
