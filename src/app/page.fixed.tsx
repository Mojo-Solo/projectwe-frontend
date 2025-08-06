import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import ClientWrapper from '@/components/ClientWrapper'

// Dynamic imports for client-side components to prevent SSR issues
const DynamicHeroSection = dynamic(() => import('@/components/sections/HeroSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

const DynamicFeaturesSection = dynamic(() => import('@/components/sections/FeaturesSection'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] flex items-center justify-center">Loading features...</div>
})

const DynamicTestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] flex items-center justify-center">Loading testimonials...</div>
})

const DynamicCTASection = dynamic(() => import('@/components/sections/CTASection'), {
  ssr: false,
  loading: () => <div className="min-h-[300px] flex items-center justify-center">Loading CTA...</div>
})

// Static fallback content for SSG
const StaticFallback = () => (
  <div className="min-h-screen bg-gray-50">
    <main className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to WeeXit
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Your trusted partner for successful business exits and transitions.
        </p>
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Loading Interactive Content...</h2>
            <p className="text-gray-600">Please wait while we load the full experience.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
)

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <ClientWrapper fallback={<StaticFallback />}>
        <Suspense fallback={<StaticFallback />}>
          <main>
            {/* Hero Section */}
            <section className="hero-section">
              <DynamicHeroSection />
            </section>

            {/* Features Section */}
            <section className="features-section">
              <DynamicFeaturesSection />
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
              <DynamicTestimonialsSection />
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <DynamicCTASection />
            </section>
          </main>
        </Suspense>
      </ClientWrapper>
    </div>
  )
}

// Add static generation metadata
export const metadata = {
  title: 'WeeXit - Business Exit Planning & Transitions',
  description: 'Expert guidance for successful business exits, mergers, and transitions. Maximize your business value with our comprehensive exit planning services.',
  keywords: 'business exit, exit planning, business transition, mergers, acquisitions, business valuation',
  authors: [{ name: 'WeeXit Team' }],
  openGraph: {
    title: 'WeeXit - Business Exit Planning & Transitions',
    description: 'Expert guidance for successful business exits, mergers, and transitions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeeXit - Business Exit Planning & Transitions',
    description: 'Expert guidance for successful business exits, mergers, and transitions.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}