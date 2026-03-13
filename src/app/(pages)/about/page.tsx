import Image from "next/image";
import image1 from "../../../../public/images/ali-marel-489801-unsplash.jpg";
import achievements1 from "../../../../public/images/faye-cornish-n3XTxxV7qhI-unsplash.jpg";
import achievements2 from "../../../../public/images/manuel-nobauer-M_GouNr9Zek-unsplash.jpg";
import achievements3 from "../../../../public/images/valdemaras-d-1053561-unsplash-768x432.jpg";
import employer1 from "../../../../public/images/philipe-cavalcante-576695-unsplash-293x300.jpg";
import employer2 from "../../../../public/images/jakob-owens-565883-unsplash-293x300.jpg";
import employer3 from "../../../../public/images/julian-schropel-1165717-unsplash-293x300.jpg";

import style from "./about.module.css";
import { GoCheckCircle } from "react-icons/go";
import { IoCubeOutline } from "react-icons/io5";
import { FaFacebook, FaFeather, FaInstagramSquare } from "react-icons/fa";
import Statistics from "./statistics";
import { FaSquareXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Articles Platform",
  description:
    "Discover our articles platform where users can read, like, bookmark, and share insightful content.",
  openGraph: {
    title: "About | Articles Platform",
    description:
      "Learn more about our articles platform and how we help people discover great content.",
    images: ["/public/next.svg"],
  },
};

export default function About() {
  return (
    <div className="about">
      <div className={`py-12 px-5 ${style.header} relative`}>
        <div className="text-center p-4 relative dark:z-1">
          <h1 className="font-bold mb-4 text-4xl sm:text-6xl ">About Us</h1>
          <p className="font-light">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut eos
            magni provident adipisicing elit. Ut eos magni provident
          </p>
        </div>
        <div className="dark:absolute dark:inset-0 dark:bg-black/50 dark:z-0"></div>
      </div>

      <div className="ourStory py-12 px-5">
        <div className="flex justify-center items-center  flex-col md:flex-row">
          <div className="basis-1/2 m-4 p-5  sm:p-12">
            <Image className="rounded-md" alt="our story" src={image1} />
          </div>
          <div className="basis-1/2 p-4">
            <h2 className=" font-bold mb-12  text-4xl">Our Story</h2>

            <p className="font-light mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
              aspernatur adipisci reiciendis minus labore provident tempora ea
              dolorum distinctio. Perspiciatis quibusdam aliquid quos corporis
              vel eveniet sint asperiores ex nesciunt.
            </p>
            <p className="font-light mb-4">
              dolorum distinctio. Perspiciatis quibusdam aliquid quos corporis
              vel eveniet sint asperiores ex nesciunt.
            </p>
            <h2 className=" font-bold my-8  text-4xl ">About Our Company</h2>
            <p className="font-light mb-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam,
              earum, ea quod in fuga magnam inventore cumque aliquam sint
              repudiandae sequi unde. Amet quod, consequuntur cupiditate
              accusamus iure quisquam et. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Numquam, earum, ea quod in fuga
            </p>
            <p className="font-light mt-12">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam,
              earum, ea quod in fuga magnam inventore cumque aliquam sint
              repudiandae sequi unde. Amet quod, consequuntur cupiditate
              accusamus iure quisquam et.
            </p>
          </div>
        </div>

        <div className="flex flex-col mt-12 gap-8 md:flex-row md:justify-center md:items-center">
          <div>
            <span className="p-5 text-3xl font-bold text-white bg-primary w-fit rounded-full block">
              <GoCheckCircle />
            </span>
            <h3 className="text-2xl font-bold my-2">Authencity</h3>
            <p className="font-light">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi
              quae sapiente, vero porro ut asperiores. Dignissimos voluptas
              voluptates non accusamus quia, quis
            </p>
          </div>
          <div>
            <span className="p-5 text-3xl font-bold text-white bg-primary w-fit rounded-full block">
              <IoCubeOutline />
            </span>
            <h3 className="text-2xl font-bold my-2">Real Engagement</h3>
            <p className="font-light">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi
              quae sapiente, vero porro ut asperiores. Dignissimos voluptas
              voluptates non accusamus quia, quis
            </p>
          </div>
          <div>
            <span className="p-5 text-3xl font-bold text-white bg-primary w-fit rounded-full block">
              <FaFeather />
            </span>
            <h3 className="text-2xl font-bold my-2">Unique Stories</h3>
            <p className="font-light">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi
              quae sapiente, vero porro ut asperiores. Dignissimos voluptas
              voluptates non accusamus quia, quis
            </p>
          </div>
        </div>
      </div>

      <div className={`${style.achievements} py-12 px-5 relative`}>
        <div className="dark:absolute dark:inset-0 dark:bg-black/50 dark:z-0"></div>

        <h1 className="font-bold mb-4 text-4xl text-center relative dark:z-1">
          Our Achievements
        </h1>
        <p className="text-center font-light relative dark:z-1">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut eos magni
          provident adipisicing elit. Ut eos magni provident
        </p>

        <div className="flex justify-center gap-5 items-center  flex-col sm:flex-row mt-12 relative dark:z-1">
          <div className="rounded-md bg-white dark:bg-black">
            <div className="">
              <Image
                className="rounded-t-md h-75 w-full"
                src={achievements1}
                alt="achievements1"
              />
            </div>
            <div className="text p-2 pb-4 text-center">
              <h3 className="font-bold sm:text-2xl my-4">
                Lorem ipsum dolor, sit amet consectetur
              </h3>
              <p className="font-light">
                nesciunt officiis aperiam amet qui rem. Harum consequuntur vero
                nesciunt consectetur mollitia!
              </p>
            </div>
          </div>
          <div className="rounded-md bg-white dark:bg-black">
            <div>
              <Image
                className="rounded-t-md h-75 w-full"
                src={achievements2}
                alt="achievements2"
              />
            </div>
            <div className="text p-2 pb-4  text-center">
              <h3 className="font-bold sm:text-2xl my-4">
                Lorem ipsum dolor, sit amet consectetur
              </h3>
              <p className="font-light">
                nesciunt officiis aperiam amet qui rem. Harum consequuntur vero
                nesciunt consectetur mollitia!
              </p>
            </div>
          </div>
          <div className="rounded-md bg-white dark:bg-black">
            <div>
              <Image
                className="rounded-t-md h-75 w-full"
                src={achievements3}
                alt="achievements3"
              />
            </div>
            <div className="text p-2 pb-4  text-center">
              <h3 className="font-bold sm:text-2xl my-4">
                Lorem ipsum dolor, sit amet consectetur
              </h3>
              <p className="font-light">
                nesciunt officiis aperiam amet qui rem. Harum consequuntur vero
                nesciunt consectetur mollitia!
              </p>
            </div>
          </div>
        </div>

        <Statistics />
      </div>

      <div className="employers py-12 px-5 flex justify-center gap-5 items-center  flex-col sm:flex-row ">
        <div className="bg-white dark:bg-black rounded-md p-5 flex justify-center items-center flex-col w-full">
          <div className="sm:w-38 sm:h-38">
            <Image
              className="rounded-full w-full h-full "
              src={employer1}
              alt="employer1"
            />
          </div>
          <div className="text p-2 pb-4 text-center">
            <h3 className="font-bold text-2xl my-4">Scott Estrada</h3>
            <p className="font-light">Developer</p>
          </div>
          <div className="scial flex gap-2 my-4 flex-wrap text-3xl justify-center">
            <Link className="text-primary" href={"/"}>
              <FaFacebook />
            </Link>
            <Link className="text-primary" href={"/"}>
              {" "}
              <FaInstagramSquare />
            </Link>

            <Link className="text-primary" href={"/"}>
              {" "}
              <FaSquareXTwitter />
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-md p-5 flex justify-center items-center flex-col w-full">
          <div className=" sm:w-38 sm:h-38">
            <Image
              className="rounded-full w-full h-full"
              src={employer2}
              alt="employer2"
            />
          </div>
          <div className="text p-2 pb-4 text-center">
            <h3 className="font-bold text-2xl my-4">Barbara Ramos</h3>
            <p className="font-light">Graphic Designer</p>
          </div>
          <div className="scial flex gap-2 my-4 flex-wrap text-3xl justify-center">
            <Link className="text-primary" href={"/"}>
              <FaFacebook />
            </Link>
            <Link className="text-primary" href={"/"}>
              {" "}
              <FaInstagramSquare />
            </Link>

            <Link className="text-primary" href={"/"}>
              {" "}
              <FaSquareXTwitter />
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-md p-5 flex justify-center items-center  flex-col w-full">
          <div className=" sm:w-38 sm:h-38">
            <Image
              className="rounded-full w-full h-full"
              src={employer3}
              alt="employer3"
            />
          </div>
          <div className="text p-2 pb-4 text-center">
            <h3 className="font-bold text-2xl my-4">Angela Caroll</h3>
            <p className="font-light">Chief Editor</p>
          </div>
          <div className="social flex gap-2 my-4 flex-wrap text-3xl justify-center ">
            <Link className="text-primary" href={"/"}>
              <FaFacebook />
            </Link>
            <Link className="text-primary" href={"/"}>
              {" "}
              <FaInstagramSquare />
            </Link>

            <Link className="text-primary" href={"/"}>
              {" "}
              <FaSquareXTwitter />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
