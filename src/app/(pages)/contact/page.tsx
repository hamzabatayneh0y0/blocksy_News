import { FaLocationDot } from "react-icons/fa6";
import style from "./contact.module.css";
import { SiMinutemailer } from "react-icons/si";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import Video from "./video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a question or feedback? Contact our team and we will get back to you as soon as possible.",
  openGraph: {
    title: "Contact",
    description:
      "Reach out to us for support, inquiries, or collaboration opportunities.",
  },
};

const contactItems = [
  {
    icon: FaLocationDot,
    title: "Physical Address",
    content: (
      <>
        304 North Cardinal St.
        <br />
        Dorchester Center, MA 02124
      </>
    ),
  },
  {
    icon: SiMinutemailer,
    title: "Email Address",
    content: (
      <Link
        href="mailto:info@company.com"
        className="font-light transition-colors hover:text-primary"
      >
        info@company.com
        <br />
        contact@company.com
      </Link>
    ),
  },
  {
    icon: FaPhoneAlt,
    title: "Phone Number",
    content: (
      <>
        1-555-123-4567
        <br />
        1-800-123-4567
      </>
    ),
  },
];

export default function Contact() {
  return (
    <div className="flex-1">
      {/* Header */}
      <section className={`relative px-5 py-16 ${style.header}`}>
        <div className="relative z-[1] mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-6xl">Say Hello!</h1>

          <p className="font-light text-muted-foreground">
            Our staff would love to hear from you
          </p>
        </div>

        <div className="absolute inset-0 bg-black/20 dark:bg-black/50" />
      </section>

      {/* Contact information */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Our Team is at your complete disposal for any questions
            </h2>

            <p className="font-light text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
              explicabo est reprehenderit iusto nemo sed incidunt, veritatis
              deleniti atque possimus.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex min-h-64 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex size-20 items-center justify-center rounded-full bg-primary text-3xl text-white sm:size-24 sm:text-4xl">
                    <Icon />
                  </div>

                  <h3 className="my-4 text-xl font-bold sm:text-2xl">
                    {item.title}
                  </h3>

                  <div className="font-light text-muted-foreground">
                    {item.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video + Form */}
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Video */}
          <Video />

          {/* Form */}
          <div>
            <h2 className="mb-5 text-2xl font-bold sm:text-3xl">
              We are here to help
            </h2>

            <p className="font-light text-muted-foreground">
              Need some help? Fill out the form below and our staff will be in
              touch!
            </p>

            <form className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Name
                </label>

                <input
                  id="username"
                  type="text"
                  required
                  className="rounded-lg border bg-background px-3 py-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  className="rounded-lg border bg-background px-3 py-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  required
                  className="rounded-lg border bg-background px-3 py-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Comment or Message
                </label>

                <textarea
                  id="message"
                  required
                  rows={5}
                  className="resize-none rounded-lg border bg-background px-3 py-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="mx-auto mt-2 w-fit cursor-pointer rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-all hover:opacity-90 active:scale-95"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
