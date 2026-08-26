import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { GoCheckCircle } from "react-icons/go";
import { IoCubeOutline } from "react-icons/io5";
import { FaFacebook, FaFeather, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import image1 from "../../../../public/images/ali-marel-489801-unsplash.jpg";
import achievements1 from "../../../../public/images/faye-cornish-n3XTxxV7qhI-unsplash.jpg";
import achievements2 from "../../../../public/images/manuel-nobauer-M_GouNr9Zek-unsplash.jpg";
import achievements3 from "../../../../public/images/valdemaras-d-1053561-unsplash-768x432.jpg";
import employer1 from "../../../../public/images/philipe-cavalcante-576695-unsplash-293x300.jpg";
import employer2 from "../../../../public/images/jakob-owens-565883-unsplash-293x300.jpg";
import employer3 from "../../../../public/images/julian-schropel-1165717-unsplash-293x300.jpg";

import Statistics from "./statistics";

export const metadata: Metadata = {
  title: "About | Articles Platform",
  description:
    "Discover our articles platform where users can read, like, bookmark, and share insightful content.",
  openGraph: {
    title: "About | Articles Platform",
    description:
      "Learn more about our articles platform and how we help people discover great content.",
  },
};

const values = [
  {
    icon: GoCheckCircle,
    title: "Authenticity",
    description:
      "We believe in genuine stories, honest perspectives, and content that feels meaningful rather than manufactured.",
  },
  {
    icon: IoCubeOutline,
    title: "Real Engagement",
    description:
      "Our platform encourages readers to discover, interact with, and save the content that genuinely interests them.",
  },
  {
    icon: FaFeather,
    title: "Unique Stories",
    description:
      "Every writer has a different perspective. We create a space where different ideas and stories can be discovered.",
  },
];

const achievements = [
  {
    image: achievements1,
    title: "A Growing Community",
    description:
      "Bringing readers and writers together through meaningful and engaging content.",
  },
  {
    image: achievements2,
    title: "Discover New Ideas",
    description:
      "Helping readers explore different perspectives, topics, and experiences every day.",
  },
  {
    image: achievements3,
    title: "Built for Everyone",
    description:
      "A simple platform designed to make reading, sharing, and discovering articles enjoyable.",
  },
];

const team = [
  {
    image: employer1,
    name: "Scott Estrada",
    role: "Developer",
  },
  {
    image: employer2,
    name: "Barbara Ramos",
    role: "Graphic Designer",
  },
  {
    image: employer3,
    name: "Angela Caroll",
    role: "Chief Editor",
  },
];

export default function About() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative isolate border-b bg-linear-to-br from-primary/8 via-background to-background px-5 py-20 sm:py-28">
        <div className="absolute -right-32 -top-32 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            About our platform
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Stories worth <span className="text-primary">discovering.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            A place where curious readers discover interesting ideas, meaningful
            stories, and perspectives from people around the world.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative">
            <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-2xl bg-primary/10" />

            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={image1}
                alt="Our story"
                className="h-auto w-full object-cover"
                placeholder="blur"
                priority
              />
            </div>

            <div className="absolute -bottom-6 right-5 rounded-xl border bg-card px-5 py-4 shadow-lg">
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-xs text-muted-foreground">Built for readers</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our story
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built around the joy of discovering great content.
            </h2>

            <p className="mt-6 leading-7 text-muted-foreground">
              We created this platform with a simple idea: discovering a good
              article should feel effortless. Instead of overwhelming readers
              with endless content, we want to make it easier to find stories
              that are actually worth their time.
            </p>

            <p className="mt-4 leading-7 text-muted-foreground">
              Readers can explore articles, interact with writers, save
              interesting content, and share stories with others.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">01</p>
                <p className="mt-1 text-sm text-muted-foreground">Discover</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">02</p>
                <p className="mt-1 text-sm text-muted-foreground">Connect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              What we believe in
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built on simple values
            </h2>

            <p className="mt-4 text-muted-foreground">
              The principles behind the experience we want to create.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">{value.title}</h3>

                  <p className="mt-3 leading-7 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="relative px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our achievements
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              More than just articles
            </h2>

            <p className="mt-4 text-muted-foreground">
              We are building an experience around discovery, interaction, and
              meaningful content.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {achievements.map((achievement) => (
              <article
                key={achievement.title}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={achievement.image}
                    alt={achievement.title}
                    fill
                    placeholder="blur"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold">{achievement.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <Statistics />
        </div>
      </section>

      {/* Team */}
      <section className="border-t bg-muted/40 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              The team
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              The people behind the platform
            </h2>

            <p className="mt-4 text-muted-foreground">
              A small team focused on creating a better way to discover and
              share stories.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto relative size-32 overflow-hidden rounded-full ring-4 ring-primary/10 sm:size-36">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    placeholder="blur"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <h3 className="mt-6 text-xl font-bold">{member.name}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {member.role}
                </p>

                <div className="mt-5 flex justify-center gap-4 text-2xl text-primary">
                  <Link
                    href="/"
                    aria-label={`${member.name} Facebook`}
                    className="transition-transform hover:-translate-y-1"
                  >
                    <FaFacebook />
                  </Link>

                  <Link
                    href="/"
                    aria-label={`${member.name} Instagram`}
                    className="transition-transform hover:-translate-y-1"
                  >
                    <FaInstagramSquare />
                  </Link>

                  <Link
                    href="/"
                    aria-label={`${member.name} X`}
                    className="transition-transform hover:-translate-y-1"
                  >
                    <FaSquareXTwitter />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-xl sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to discover something new?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Explore articles, find new perspectives, and save the stories you
            want to come back to.
          </p>

          <Link
            href="/articles"
            className="mt-8 inline-flex rounded-xl bg-background px-6 py-3 font-semibold text-foreground shadow-sm transition hover:opacity-90"
          >
            Explore Articles
          </Link>
        </div>
      </section>
    </main>
  );
}
