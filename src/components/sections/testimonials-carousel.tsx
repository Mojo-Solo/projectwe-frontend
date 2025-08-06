
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { MdOutlineFormatQuote } from "react-icons/md";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "YouTube",
  "Instagram",
  "Uber",
  "Spotify",
];

const testimonials = [
  {
    quote:
      "Exit Planning AI has revolutionized our client onboarding process. New advisors are contributing meaningful work within days instead of weeks. The ROI is undeniable.",
    name: "Leslie Alexander",
    role: "CTO, ExitPro Advisors",
    company: "Google",
  },
  {
    quote:
      "Our exit planning team's ramp-up time decreased by 65% after implementing Exit Planning AI. New advisors are closing deals faster with access to our collective expertise.",
    name: "Michael Chen",
    role: "VP of Exit Planning",
    company: "Microsoft",
  },
  {
    quote:
      "As we scaled from 50 to 250 advisors, Exit Planning AI ensured our company culture and critical knowledge wasn't diluted. It's been essential to maintaining our momentum.",
    name: "Sarah Johnson",
    role: "Chief People Officer",
    company: "Amazon",
  },
  {
    quote:
      "The exit planning team loves how Exit Planning AI preserves context around technical decisions. New advisors understand not just what we recommend, but why we recommend it.",
    name: "David Rodriguez",
    role: "Exit Planning Director",
    company: "Netflix",
  },
  {
    quote:
      "Exit Planning AI captures the human element of our business that generic AI tools miss. It's like having our best exit planners mentor every new hire automatically.",
    name: "Priya Patel",
    role: "CEO",
    company: "YouTube",
  },
  {
    quote:
      "The seamless integration with our existing tools means teams actually use it. No extra work, just better exit planning results. That's what makes Exit Planning AI different.",
    name: "James Wilson",
    role: "COO",
    company: "Instagram",
  },
  {
    quote:
      "We've tried knowledge bases, wikis, and AI tools. Exit Planning AI is the first solution that actually delivers exit planning expertise where and when our advisors need it.",
    name: "Emma Thompson",
    role: "Director of Operations",
    company: "Uber",
  },
];

export default function Component() {
  return (
    <Section
      title="Testimonials"
      subtitle="What our customers are saying"
      description="Hear from exit planning professionals who have transformed their practice with our platform"
    >
      <Carousel>
        <div className="max-w-2xl mx-auto relative">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="p-2 pb-5">
                  <div className="text-center">
                    <MdOutlineFormatQuote className="text-4xl text-themeDarkGray my-4 mx-auto" />
                    <BlurFade delay={0.25} inView>
                      <h4 className="text-1xl font-semibold max-w-lg mx-auto px-10">
                        {testimonial.quote}
                      </h4>
                    </BlurFade>
                    <BlurFade delay={0.25 * 2} inView>
                      <div className="mt-8">
                        <Image
                          width={0}
                          height={40}
                          key={index}
                          src={`https://cdn.magicui.design/companies/${testimonial.company}.svg`}
                          alt={`${testimonial.company} Logo`}
                          className="mx-auto w-auto h-[40px] grayscale opacity-30"
                        />
                      </div>
                    </BlurFade>
                    <div className="">
                      <BlurFade delay={0.25 * 3} inView>
                        <h4 className="text-1xl font-semibold my-2">
                          {testimonial.name}
                        </h4>
                      </BlurFade>
                    </div>
                    <BlurFade delay={0.25 * 4} inView>
                      <div className=" mb-3">
                        <span className="text-sm text-themeDarkGray">
                          {testimonial.role}
                        </span>
                      </div>
                    </BlurFade>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-2/12 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full  w-2/12 bg-gradient-to-l from-background"></div>
        </div>
        <div className="md:block hidden">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </Section>
  );
}
