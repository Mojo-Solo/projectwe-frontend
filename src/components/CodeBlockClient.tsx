'use client';

import { useEffect, useState } from 'react';

interface CodeBlockClientProps {
  children: string;
  language?: string;
  className?: string;
}

export default function CodeBlockClient({ children, language, className }: CodeBlockClientProps) {
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function highlightCode() {
      try {
        // Dynamic import of Shiki to avoid SSR issues
        const { codeToHtml } = await import('shiki');
        
        const html = await codeToHtml(children, {
          lang: language || 'text',
          theme: 'github-dark'
        });
        
        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        // Fallback to plain code if highlighting fails
        setHighlightedCode(null);
      } finally {
        setIsLoading(false);
      }
    }

    highlightCode();
  }, [children, language]);

  if (isLoading) {
    return (
      <pre className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto ${className || ''}`}>
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
    );
  }

  if (highlightedCode) {
    return (
      <div 
        className={`overflow-x-auto ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    );
  }

  // Fallback to plain code block
  return (
    <pre className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto ${className || ''}`}>
      <code className={language ? `language-${language}` : ''}>
        {children}
      </code>
    </pre>
  );
}