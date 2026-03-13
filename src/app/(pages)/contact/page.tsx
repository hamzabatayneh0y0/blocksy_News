import { FaLocationDot } from "react-icons/fa6";
import style from "./contact.module.css";
import { SiMinutemailer } from "react-icons/si";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import Video from "./video";

export const metadata = {
  title: "Contact",
  description:
    "Have a question or feedback? Contact our team and we will get back to you as soon as possible.",
  openGraph: {
    title: "Contact",
    description:
      "Reach out to us for support, inquiries, or collaboration opportunities.",
    images: ["/public/next.svg"],
  },
};

export default function Contact() {
  return (
    <div className="">
      <div className={`py-12 px-5 ${style.header} shadow-xl  relative`}>
        <div className="text-center p-4 relative dark:z-1">
          <h1 className="font-bold mb-4 text-4xl sm:text-6xl ">Say Hello!</h1>
          <p className="font-light">Our staff would love to hear from you</p>
        </div>
        <div className="dark:absolute dark:inset-0 dark:bg-black/50 dark:z-0"></div>
      </div>

      <div className="py-12 px-5 adresses">
        <div className="mb-12  text-center">
          <h2 className="font-bold mb-4 text-2xl sm:text-3xl ">
            Our Team is at your complete disposal for any questions
          </h2>
          <p className="font-light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
            explicabo est reprehenderit iusto nemo sed incidunt, veritatis
            deleniti atque possimus non soluta quod expedita
          </p>
        </div>

        <div className="mt-15 flex justify-center gap-6 items-stretch  flex-col sm:flex-row ">
          <div className="bg-white  dark:bg-black dark:shadow-lg dark:shadow-white rounded-md p-5 flex items-center flex-col w-full sm:w-1/3">
            <div className="p-5 rounded-full bg-primary text-white dark:text-white text-2xl sm:text-4xl sm:p-8 ">
              <FaLocationDot className="" />
            </div>
            <div className="text p-2 pb-4 text-center">
              <h3 className="font-bold text-2xl my-4">Physical Address</h3>
              <p className="font-light">
                304 North Cardinal St. Dorchester Center, MA 02124
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-black dark:shadow-lg dark:shadow-white  rounded-md p-5 flex  items-center flex-col w-full sm:w-1/3">
            <div className="p-5 rounded-full bg-primary text-white dark:text-white text-2xl sm:text-4xl sm:p-8">
              <SiMinutemailer />
            </div>
            <div className="text p-2 pb-4 text-center">
              <h3 className="font-bold text-2xl my-4">Email Address</h3>
              <p>
                <Link href={""} className="font-light">
                  info@company.com <br /> contact@company.com
                </Link>
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-black rounded-md p-5 flex dark:shadow-lg dark:shadow-white items-center flex-col w-full sm:w-1/3">
            <div className="p-5 rounded-full bg-primary text-white dark:text-white text-2xl sm:text-4xl sm:p-8">
              <FaPhoneAlt />
            </div>
            <div className="text p-2 pb-4 text-center">
              <h3 className="font-bold text-2xl my-4">Phone Number</h3>
              <p className="font-light">
                1-555-123-4567 <br />
                1-800-123-4567
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-5 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
        <Video />
        <div className="">
          <h3 className="font-bold  text-2xl sm:text-3xl mb-5">
            We are here to help
          </h3>
          <p className="font-light">
            Need some help? Fill out the form below and our staff will be in
            touch!
          </p>
          <form action="" className="mt-12 flex flex-col gap-2 justify-center">
            <div className="flex flex-col gap-1">
              <label htmlFor="username">Name</label>
              <input
                id="username"
                type="text"
                className="border  inset-shadow-2xs px-2 py-3 rounded-md bg-white dark:bg-black dark:inset-shadow-white "
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="border inset-shadow-2xs px-2 py-3 rounded-md bg-white dark:bg-black dark:inset-shadow-white"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                className="border  inset-shadow-2xs px-2 py-3 rounded-md bg-white dark:bg-black dark:inset-shadow-white"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="message">Comment or Message</label>
              <textarea
                id="message"
                name=""
                className="border inset-shadow-2xs px-2 py-3 rounded-md bg-white resize-none dark:bg-black dark:inset-shadow-white"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-fit bg-primary text-white cursor-pointer rounded-md m-auto px-3 py-1"
            >
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
