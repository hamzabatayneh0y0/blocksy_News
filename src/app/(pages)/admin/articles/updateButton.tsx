"use client";

import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type updateFormResult = {
  title: string;
  description: string;
};

export default function UpdateButton({
  id,
  title,
  description,
}: {
  id: number;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const updateArticle = () => {
    Swal.fire<updateFormResult>({
      title: "write a comment",
      html: `
    <input type="text" id="title" class="p-3 border rounded-md inset-shadow-2xs shadow-black bg-white w-full mb-2" placeholder="comment" value=${title}>
    <input type="text" id="description" class="p-3 border rounded-md inset-shadow-2xs shadow-black bg-white w-full" placeholder="comment" value=${description}>

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

        const title = popup.querySelector("#title") as HTMLInputElement;
        const description = popup.querySelector(
          "#description",
        ) as HTMLInputElement;

        title.onkeyup = (event) => event.key === "Enter" && Swal.clickConfirm();
        description.onkeyup = (event) =>
          event.key === "Enter" && Swal.clickConfirm();
      },
      preConfirm: () => {
        const popup = Swal.getPopup()!;

        const title = popup.querySelector("#title") as HTMLInputElement;
        const description = popup.querySelector(
          "#description",
        ) as HTMLInputElement;
        if (!title.value || !description.value) {
          Swal.showValidationMessage(`Please write something`);
        }
        return { title: title.value, description: description.value };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updateComment = async () => {
          try {
            await axios.put(`${DOMAIN}/api/articles/${id}`, {
              title: result.value?.title,
              description: result.value?.description,
            });
            router.refresh();
            toast.success("updated");
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
  return (
    <button
      onClick={async () => {
        updateArticle();
      }}
      className="bg-green-500 text-white text-center font-bold rounded-md p-1 capitalize m-auto block  hover:text-green-500 hover:bg-white duration-300 cursor-pointer shadow-xl w-full "
    >
      Update
    </button>
  );
}
