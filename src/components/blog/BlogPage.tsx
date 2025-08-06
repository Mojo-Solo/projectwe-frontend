import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug } from '@/lib/mdx-utils'

interface BlogPageProps {
  slug: string
}

export default async function BlogPage({ slug }: BlogPageProps) {
  let post
  
  try {
    post = getBlogPostBySlug(slug)
    
    if (!post) {
      notFound()
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.frontmatter?.title || 'Untitled'}</h1>
        {post.frontmatter?.date && (
          <time className="text-gray-600" dateTime={post.frontmatter.date}>
            {new Date(post.frontmatter.date).toLocaleDateString()}
          </time>
        )}
        {post.frontmatter?.author && (
          <p className="text-gray-600 mt-2">By {post.frontmatter.author}</p>
        )}
      </header>
      
      <Suspense fallback={<div>Loading content...</div>}>
        <div className="prose prose-lg max-w-none">
          <MDXContent content={post.content} />
        </div>
      </Suspense>
    </article>
  )
}

// Safe MDX content renderer
function MDXContent({ content }: { content: string }) {
  try {
    // Simple content rendering for now - can be enhanced with MDX processing
    return (
      <div 
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  } catch (error) {
    console.error('Error rendering MDX content:', error)
    return (
      <div className="text-red-600">
        <p>Error loading blog content. Please try again later.</p>
      </div>
    )
  }
}