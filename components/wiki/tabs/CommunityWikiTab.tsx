"use client";

import { Project, WikiPost } from "@/types/modrinth";
import { BookOpen, User, Calendar, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { CreateWikiPost } from "./CreateWikiPost";
import { MarkdownRenderer } from "../MarkdownRenderer";

interface CommunityWikiTabProps {
  project: Project;
}

export function CommunityWikiTab({ project }: CommunityWikiTabProps) {
  const [session, setSession] = useState<unknown>(null);
  const [posts, setPosts] = useState<WikiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  const isConfigured = isSupabaseConfigured();
  const supabase = isConfigured ? createClient() : null;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('wiki_posts')
        .select(`
          *,
          profiles (username, full_name, avatar_url)
        `)
        .eq('project_slug', project.slug)
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [project.slug, supabase]);

  const handleSuccess = () => {
    if (!supabase) return;
    setShowEditor(false);
    // Reload posts after a successful creation
    setLoading(true);
    supabase
        .from('wiki_posts')
        .select(`
          *,
          profiles (username, full_name, avatar_url)
        `)
        .eq('project_slug', project.slug)
        .order('created_at', { ascending: false })
        .then(({data}) => {
             if (data) setPosts(data);
             setLoading(false);
        });
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-6 md:p-10 shadow-xl overflow-hidden min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[var(--color-border-subtle)] pb-6">
        <div>
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[var(--color-brand)]" />
            Community Wiki
          </h3>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
            Player-created guides, tutorials, and documentation for {project.title}.
          </p>
        </div>

        {session ? (
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-2 rounded-md bg-[var(--color-background-surface)] border border-[var(--color-border-subtle)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
          >
             <PlusCircle className="w-4 h-4" />
             {showEditor ? "Cancel" : "Create Post"}
          </button>
        ) : (
          <div className="text-sm text-[var(--color-text-muted)] bg-[var(--color-background-surface)] px-4 py-2 rounded-md border border-[var(--color-border-subtle)]">
            Sign in to contribute
          </div>
        )}
      </div>

      {showEditor && (
         <CreateWikiPost projectSlug={project.slug} onSuccess={handleSuccess} />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="border border-[var(--color-border-subtle)] bg-[var(--color-background-base)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[var(--color-border-subtle)] bg-[var(--color-background-surface)]">
                <h4 className="text-xl font-bold text-white mb-3">{post.title}</h4>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1.5 font-medium text-[var(--color-text-secondary)]">
                    {post.profiles?.avatar_url ? (
                        <img src={post.profiles.avatar_url} alt="author" className="w-5 h-5 rounded-full" />
                    ) : (
                        <User className="w-4 h-4" />
                    )}
                    {post.profiles?.username || post.profiles?.full_name || 'Anonymous User'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="p-6 prose-sm">
                <MarkdownRenderer content={post.content} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20">
           <BookOpen className="w-16 h-16 text-[var(--color-border-subtle)] mb-6" />
           <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">No community posts yet.</p>
           <p className="text-[var(--color-text-muted)] text-sm max-w-sm">Be the first to share your knowledge about {project.title}!</p>
        </div>
      )}
    </div>
  );
}
