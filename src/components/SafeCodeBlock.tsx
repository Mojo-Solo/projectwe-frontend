'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Shiki
const CodeBlock = dynamic(
  () => import('./CodeBlockClient'),
  {
    ssr: false,
    loading: () => (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>Loading syntax highlighting...</code>
      </pre>
    )
  }
);

interface SafeCodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export default function SafeCodeBlock({ children, language, className }: SafeCodeBlockProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fallback for SSR - plain code block
  if (!isClient) {
    return (
      <pre className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto ${className || ''}`}>
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
    );
  }

  // Client-side rendered with syntax highlighting
  return <CodeBlock language={language} className={className}>{children}</CodeBlock>;
}