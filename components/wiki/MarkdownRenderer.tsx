"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { isValidHref } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-headings:font-bold prose-a:text-[var(--color-brand)] prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-4 hover:prose-a:decoration-[var(--color-brand)] prose-pre:bg-[var(--color-background-surface)] prose-pre:border prose-pre:border-[var(--color-border-subtle)] w-full overflow-hidden break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          img: ({node, ...props}) => (
            <span className="flex justify-center my-8">
              <img {...props} className="rounded-xl shadow-lg border border-[var(--color-border-subtle)] max-w-full h-auto" loading="lazy" />
            </span>
          ),
          a: ({node, ...props}) => {
            const safeHref = isValidHref(props.href) ? props.href : '#';
            return (
              <a
                {...props}
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
              />
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
