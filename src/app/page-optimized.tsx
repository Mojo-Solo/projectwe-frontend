
interface HomeOptimizedProps {
  className?: string;
  children?: React.ReactNode;
}

import Blog from "@/components/sections/blog";
import CTA from "@/components/sections/cta";
import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import HowItWorks from "@/components/sections/how-it-works";
import Logos from "@/components/sections/logos";
import Pricing from "@/components/sections/pricing";
import Problem from "@/components/sections/problem";
import Solution from "@/components/sections/solution";
import Testimonials from "@/components/sections/testimonials";
import TestimonialsCarousel from "@/components/sections/testimonials-carousel";
import { LazySection } from "@/components/ui/lazy-section";

export default function HomeOptimized() {
  return (
    <main>
      {/* Above-the-fold content - loads immediately */}
      <Header />
      <Hero />
      <Logos />
      
      {/* Core value proposition - loads on scroll */}
      <LazySection>
        <Problem />
        <Solution />
      </LazySection>
      
      {/* Secondary content - loads on demand or user interaction */}
      <LazySection>
        <HowItWorks />
        <Features />
      </LazySection>
      
      {/* Social proof - loads when user shows engagement */}
      <LazySection>
        <TestimonialsCarousel />
      </LazySection>
      
      {/* Conversion-focused content - loads near bottom */}
      <LazySection>
        <Pricing />
        <FAQ />
      </LazySection>
      
      {/* Final engagement - loads last */}
      <LazySection>
        <Blog />
        <CTA />
      </LazySection>
      
      <Footer />
    </main>
  );
}