// Temporary safe home page to resolve server error
// Replace your current page.tsx with this content

import { Suspense } from 'react';
import { Metadata } from 'next';

// Remove the problematic dynamic export temporarily
// export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Weexit Marketing - Exit Planning Solutions',
  description: 'Professional exit planning and business transition services',
};

// Safe component that won't cause SSR issues
function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Weexit Marketing
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Professional exit planning and business transition services to help you 
            maximize your business value and plan your successful exit.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Exit Planning</h2>
              <p className="text-gray-600">
                Strategic planning to maximize your business value and ensure 
                a smooth transition when you're ready to exit.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Business Valuation</h2>
              <p className="text-gray-600">
                Professional business valuation services to understand your 
                company's current worth and value optimization opportunities.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Recent Insights
            </h2>
            
            <Suspense fallback={<div>Loading blog posts...</div>}>
              <RecentBlogPosts />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

// Safe blog posts component
async function RecentBlogPosts() {
  try {
    // Use the safe blog utilities
    const { getRecentPosts } = await import('../lib/blog-ssr-safe');
    const posts = await getRecentPosts(3);

    if (posts.length === 0) {
      return (
        <div className="text-gray-600">
          No blog posts available at the moment.
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article 
            key={post.slug}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {new Date(post.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return (
      <div className="text-red-600">
        Unable to load blog posts at this time.
      </div>
    );
  }
}

export default HomePage;