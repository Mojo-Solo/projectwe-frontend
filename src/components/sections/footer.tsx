
interface FooterProps {
  className?: string;
  children?: React.ReactNode;
}

import { Icons } from "@/components/icons";
import { siteConfig } from "@/lib/config";
import { ChevronRight, Mail, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  // Function to get the icon component based on iconName
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "twitter":
        return <Twitter className="h-4 w-4 mr-1" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4 mr-1" />;
      case "mail":
        return <Mail className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <footer>
      <div className="max-w-6xl mx-auto py-16 sm:px-10 px-5 pb-0">
        <a
          href="/"
          title={siteConfig.name}
          className="relative mr-6 flex items-center space-x-2"
        >
          <Icons.logo className="w-auto h-[40px]" />
          <span className="font-bold text-xl">WeExit.ai</span>
        </a>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 mt-8">
          {siteConfig.footer.map((section) => (
            <div key={`footer-section-${section.title}`} className="mb-5">
              <h2 className="font-semibold">{section.title}</h2>
              <ul>
                {section.links.map((link) => (
                  <li key={index}
                    key={`footer-link-${section.title}-${link.text}`}
                    className="my-2"
                  >
                    <Link
                      href={link.href}
                      className="group inline-flex cursor-pointer items-center justify-start gap-1 text-muted-foreground duration-200 hover:text-foreground hover:opacity-90"
                    >
                      {"iconName" in link &&
                        link.iconName &&
                        getIconComponent(link.iconName)}
                      {link.text}
                      <ChevronRight className="h-4 w-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t py-2 grid md:grid-cols-2 h-full justify-between w-full grid-cols-1 gap-1">
          <span className="text-sm tracking-tight text-foreground">
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer">
              WeExit.ai
            </Link>{" "}
            - Don&apos;t just plan exits. Lead them.
          </span>
          <ul className="flex justify-start md:justify-end text-sm tracking-tight text-foreground">
            <li className="mr-3 md:mx-4">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
            </li>
            <li className="mr-3 md:mx-4">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
