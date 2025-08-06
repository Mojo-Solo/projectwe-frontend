"use client";

import Marquee from "@/components/magicui/marquee";
import Section from "@/components/section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-primary/20 p-1 py-0.5 font-bold text-primary dark:bg-primary/20 dark:text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      // light styles
      " border border-neutral-200 bg-white",
      // dark styles
      "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
    {...(props || {})} // Spread the rest of the props here
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <Image
        width={40}
        height={40}
        src={img || ""}
        alt={name}
        className="h-10 w-10 rounded-full ring-1 ring-border ring-offset-4"
      />

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Exit Planning Advisor, Transition Partners LLC",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <p>
        WeExit.ai let me handle a larger client load with
        <Highlight>no additional overhead</Highlight> . Coordinating advisors
        used to be a<Highlight>nightmare</Highlight> , but now it&apos;s
        seamless. My clients
        <Highlight>love</Highlight> seeing how organized and on-point we are—and
        that translates into more referrals.
      </p>
    ),
  },
  {
    name: "Michael Chen",
    role: "Principal, Chen Exit Strategies",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <p>
        I&apos;ve cut
        <Highlight>65%</Highlight> of my administrative load since implementing
        WeExit.ai. Now I&apos;m spending that time building relationships,
        attracting new clients, and actually enjoying life outside work!
      </p>
    ),
  },
  {
    name: "Jennifer Blackwell",
    role: "Managing Director, Succession Advisors Group",
    img: "https://randomuser.me/api/portraits/women/83.jpg",
    description: (
      <p>
        Our team grew from 3 advisors to 15 in under a year, and WeExit.ai made
        that scaling
        <Highlight>painless</Highlight> . New hires get instant access to our
        best practices, so they&apos;re productive in
        <Highlight>days</Highlight> , not months.
      </p>
    ),
  },
  {
    name: "Carlos Gomez",
    role: "Head of Exit Planning at Business Transitions Firm",
    img: "https://randomuser.me/api/portraits/men/14.jpg",
    description: (
      <p>
        By integrating WeExit.ai&apos;s transition solutions, we&apos;ve seen a
        <Highlight>significant improvement</Highlight> in client outcomes. The
        platform&apos;s data organization capabilities have transformed how we
        approach exit planning.
      </p>
    ),
  },
  {
    name: "Aisha Khan",
    role: "Chief Exit Planning Officer at Forward Planning",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    description: (
      <p>
        WeExit.ai&apos;s market analysis tools have transformed how we approach
        exit planning trends.
        <Highlight>Our exit strategies are now data-driven</Highlight> with
        higher client engagement and better results.
      </p>
    ),
  },
  {
    name: "Tom Rivera",
    role: "Director of Exit Planning at Legacy Solutions",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    description: (
      <p>
        Implementing WeExit.ai in our client management systems has
        <Highlight>improved client outcomes significantly</Highlight> .
        We&apos;re now able to handle twice the number of clients with the same
        team size.
      </p>
    ),
  },
];

export default function Testimonials() {
  return (
    <Section
      title="Success Stories"
      subtitle="Real results from exit planning professionals"
      className="max-w-8xl"
    >
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {testimonials.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: Math.random() * 0.5,
                duration: 0.8,
              }}
            >
              <TestimonialCard {...(card || {})} />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
