import Link from "next/link";
import {
  FaFacebook,
  FaInstagramSquare,
  FaMobileAlt,
  FaPhoneAlt,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { FaLocationDot, FaSquareXTwitter } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";

export default function Footer() {
  return (
    <div className="bg-gray-100 p-5 shadow-2xl dark:shadow-white dark:bg-black">
      <div className="scial flex gap-2 my-4 flex-wrap text-2xl">
        <Link href={"/"}>
          <FaFacebook />
        </Link>
        <Link href={"/"}>
          {" "}
          <FaInstagramSquare />
        </Link>
        <Link href={"/"}>
          {" "}
          <FaYoutube />
        </Link>
        <Link href={"/"}>
          {" "}
          <FaPinterest />
        </Link>
        <Link href={"/"}>
          {" "}
          <FaSquareXTwitter />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <div>
          <h3 className="font-bold capitalize mb-4">about us</h3>
          <ul>
            <li className="font-light text-gray-900 dark:text-gray-300 ">
              <Link href="about " className="hover:text-primary deuration-300">
                About Organization
              </Link>
            </li>
            <li className="text-gray-900  font-light dark:text-gray-300 ">
              <Link href="/" className="hover:text-primary deuration-300">
                Our Clients
              </Link>
            </li>
            <li className="text-gray-900 font-light dark:text-gray-300 ">
              <Link href="/" className="hover:text-primary deuration-300">
                Our Partners
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold capitalize mb-4">Useful Information</h3>
          <p className="text-gray-900 dark:text-gray-300 font-light mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            accusamus necessitatibus optio
          </p>
          <p className="text-gray-900 dark:text-gray-300   font-light">
            nisi mollitia magni soluta assumenda voluptatum repudiandae fuga
            itaque expedita, officiis voluptas atque, explicabo aut rerum
            sapiente esse?
          </p>
        </div>
        <div>
          <h3 className="font-bold capitalize mb-4">Contact Info</h3>
          <p className="text-gray-900 dark:text-gray-300  font-light mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            accusamus necessitatibus optio
          </p>
          <ul className="">
            <li className="text-gray-900 dark:text-gray-300  font-light flex items-center flex-wrap gap-1 mt-3">
              <span className="p-4 block w-fit rounded-full bg-gray-300">
                <FaLocationDot className="text-gray-900" />
              </span>
              <div className="text text-[14px]">
                <h4 className="font-bold">Address:</h4>
                <p className="hover:text-primary deuration-300">
                  Street Name, NY 38954
                </p>
              </div>
            </li>
            <li className="text-gray-900 dark:text-gray-300  font-light flex items-center gap-1 flex-wrap mt-3">
              <span className="p-4 block w-fit  rounded-full bg-gray-300">
                <FaPhoneAlt className="text-gray-900" />
              </span>
              <div className="text text-[14px]">
                <h4 className="font-bold">Phone:</h4>
                <p>
                  <Link
                    className="hover:text-primary deuration-300"
                    href={"tel:"}
                  >
                    578-393-4937
                  </Link>
                </p>
              </div>
            </li>
            <li className="text-gray-900 dark:text-gray-300   font-light flex items-center gap-1 flex-wrap mt-3">
              <span className="p-4  block w-fit  rounded-full bg-gray-300">
                <FaMobileAlt className="text-gray-900" />
              </span>
              <div className="text text-[14px]">
                <h4 className="font-bold">Mobile:</h4>
                <p>
                  <Link
                    className="hover:text-primary deuration-300"
                    href={"tel:"}
                  >
                    578-393-4937
                  </Link>
                </p>
              </div>
            </li>
            <li className="text-gray-900 dark:text-gray-300  font-light flex items-center gap-1 flex-wrap mt-3">
              <span className="p-4  block w-fit  rounded-full bg-gray-300">
                <TbWorldWww className="text-gray-900" />
              </span>
              <div className="text text-[14px]">
                <h4 className="font-bold">Website:</h4>
                <p>
                  <Link
                    className="hover:text-primary deuration-300 dark:text-gray-300 "
                    href={"/"}
                  >
                    creativethemes.com
                  </Link>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
