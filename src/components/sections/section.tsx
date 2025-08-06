import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className="container mx-auto">{children}</div>
    </section>
  );
}

export default Section;
