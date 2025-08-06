import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs, type Post } from "@/lib/blog";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Safe wrapper for blog functions
const safeBlogOperations = {
  getPostBySlug: (slug: string): Post | null => {
    try {
      return getPostBySlug(slug);
    } catch (error) {
      console.error("Error in getPostBySlug:", error);
      return null;
    }
  },

  getPostSlugs: (): string[] => {
    try {
      return getPostSlugs();
    } catch (error) {
      console.error("Error in getPostSlugs:", error);
      return [];
    }
  },
};

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const slugs = safeBlogOperations.getPostSlugs();
    return slugs.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = safeBlogOperations.getPostBySlug(params.slug);

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      title: post.title,
      description: post.excerpt || `Read about ${post.title} on our blog.`,
      openGraph: {
        title: post.title,
        description: post.excerpt || `Read about ${post.title} on our blog.`,
        type: "article",
        publishedTime: post.date,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "Read our latest blog post.",
    };
  }
}

// Main page component with comprehensive error handling
export default function BlogPostPage({ params }: BlogPostPageProps) {
  let post: Post | null = null;
  let error: string | null = null;

  try {
    post = safeBlogOperations.getPostBySlug(params.slug);
  } catch (err) {
    console.error("Error loading blog post:", err);
    error = "Failed to load blog post content.";
  }

  // Handle not found case
  if (!post && !error) {
    notFound();
  }

  // Handle error case
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Unable to Load Post
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading this blog post. Please try
              again later.
            </p>
            <a
              href="/blog"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Blog
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render the post
  if (!post) {
    return null; // This should not happen due to notFound() call above
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <article className="prose lg:prose-xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {post.title}
            </h1>

            {post.date && (
              <div className="flex items-center text-gray-600 mb-4">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}

            {post.excerpt && (
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            {/* Safely render content */}
            <ContentRenderer content={post.content} />
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to all posts
          </a>
        </div>
      </div>
    </div>
  );
}

// Safe content renderer component
function ContentRenderer({ content }: { content: string }) {
  try {
    // For now, render as plain text or simple markdown
    // In a production app, you'd want to use a proper markdown renderer
    return <div className="whitespace-pre-wrap">{content}</div>;
  } catch (error) {
    console.error("Error rendering content:", error);
    return (
      <div className="text-gray-600 italic">
        Content could not be rendered properly.
      </div>
    );
  }
}
