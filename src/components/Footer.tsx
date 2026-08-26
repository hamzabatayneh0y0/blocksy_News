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
    <footer
      className="
        border-t
        border-border
        bg-card
        px-5
        py-8
        text-card-foreground
        shadow-2xl
      "
    >
      {/* Social Links */}
      <div className="my-4 flex flex-wrap gap-3 text-2xl">
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <FaFacebook />
        </Link>

        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <FaInstagramSquare />
        </Link>

        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <FaYoutube />
        </Link>

        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <FaPinterest />
        </Link>

        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          <FaSquareXTwitter />
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* About Us */}
        <div>
          <h3 className="mb-4 font-bold capitalize text-foreground">
            about us
          </h3>

          <ul className="space-y-2">
            <li>
              <Link
                href="about"
                className="
                  font-light
                  text-muted-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                About Organization
              </Link>
            </li>

            <li>
              <Link
                href="/"
                className="
                  font-light
                  text-muted-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                Our Clients
              </Link>
            </li>

            <li>
              <Link
                href="/"
                className="
                  font-light
                  text-muted-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                Our Partners
              </Link>
            </li>
          </ul>
        </div>

        {/* Useful Information */}
        <div>
          <h3 className="mb-4 font-bold capitalize text-foreground">
            Useful Information
          </h3>

          <div className="space-y-4">
            <p className="font-light leading-relaxed text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
              accusamus necessitatibus optio
            </p>

            <p className="font-light leading-relaxed text-muted-foreground">
              nisi mollitia magni soluta assumenda voluptatum repudiandae fuga
              itaque expedita, officiis voluptas atque, explicabo aut rerum
              sapiente esse?
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="mb-4 font-bold capitalize text-foreground">
            Contact Info
          </h3>

          <p className="mb-5 font-light leading-relaxed text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            accusamus necessitatibus optio
          </p>

          <ul className="space-y-4">
            {/* Address */}
            <li className="flex flex-wrap items-center gap-3">
              <span
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent
                  text-accent-foreground
                "
              >
                <FaLocationDot />
              </span>

              <div className="text-sm">
                <h4 className="font-bold text-foreground">Address:</h4>

                <p
                  className="
                    font-light
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                  "
                >
                  Street Name, NY 38954
                </p>
              </div>
            </li>

            {/* Phone */}
            <li className="flex flex-wrap items-center gap-3">
              <span
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent
                  text-accent-foreground
                "
              >
                <FaPhoneAlt />
              </span>

              <div className="text-sm">
                <h4 className="font-bold text-foreground">Phone:</h4>

                <p>
                  <Link
                    className="
                      font-light
                      text-muted-foreground
                      transition-colors
                      hover:text-primary
                    "
                    href="tel:"
                  >
                    578-393-4937
                  </Link>
                </p>
              </div>
            </li>

            {/* Mobile */}
            <li className="flex flex-wrap items-center gap-3">
              <span
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent
                  text-accent-foreground
                "
              >
                <FaMobileAlt />
              </span>

              <div className="text-sm">
                <h4 className="font-bold text-foreground">Mobile:</h4>

                <p>
                  <Link
                    className="
                      font-light
                      text-muted-foreground
                      transition-colors
                      hover:text-primary
                    "
                    href="tel:"
                  >
                    578-393-4937
                  </Link>
                </p>
              </div>
            </li>

            {/* Website */}
            <li className="flex flex-wrap items-center gap-3">
              <span
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent
                  text-accent-foreground
                "
              >
                <TbWorldWww />
              </span>

              <div className="text-sm">
                <h4 className="font-bold text-foreground">Website:</h4>

                <p>
                  <Link
                    className="
                      font-light
                      text-muted-foreground
                      transition-colors
                      hover:text-primary
                    "
                    href="/"
                  >
                    creativethemes.com
                  </Link>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
