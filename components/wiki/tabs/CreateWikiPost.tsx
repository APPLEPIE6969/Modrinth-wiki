"use client";

import { useState } from "react";
import { createWikiPost } from "@/lib/actions/wiki";
import { Loader2, AlertCircle } from "lucide-react";

interface CreateWikiPostProps {
  projectSlug: string;
  onSuccess: () => void;
}

export function CreateWikiPost({ projectSlug, onSuccess }: CreateWikiPostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createWikiPost(projectSlug, title, content);

      if (result.error) {
        setError(result.error);
      } else {
        setTitle("");
        setContent("");
        onSuccess();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8 border border-[var(--color-border-subtle)] p-6 rounded-xl bg-[var(--color-background-base)]">
      <h4 className="text-lg font-bold text-white mb-4">Create a new Wiki Post</h4>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., How to configure sodium for max FPS"
          className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Content (Markdown supported)</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Write your guide here..."
          className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all font-mono"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-[var(--color-brand)] px-6 py-2 text-sm font-semibold text-[#111] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-base)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Posting..." : "Submit Post"}
        </button>
      </div>
    </form>
  );
}
