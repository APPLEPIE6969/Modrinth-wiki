"use client";

import { Project, Discussion } from "@/types/modrinth";
import { MessageSquare, User, Calendar, PlusCircle, CheckCircle, CircleDot } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CreateDiscussion } from "./CreateDiscussion";
import { MarkdownRenderer } from "../MarkdownRenderer";

interface DiscussionsTabProps {
  project: Project;
}

export function DiscussionsTab({ project }: DiscussionsTabProps) {
  const [session, setSession] = useState<unknown>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const fetchDiscussions = async () => {
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          profiles (username, full_name, avatar_url)
        `)
        .eq('project_slug', project.slug)
        .order('created_at', { ascending: false });

      if (data) {
        setDiscussions(data);
      }
      setLoading(false);
    };

    fetchDiscussions();
  }, [project.slug, supabase]);

  const handleSuccess = () => {
    setShowEditor(false);
    // Reload discussions after a successful creation
    setLoading(true);
    supabase
        .from('discussions')
        .select(`
          *,
          profiles (username, full_name, avatar_url)
        `)
        .eq('project_slug', project.slug)
        .order('created_at', { ascending: false })
        .then(({data}) => {
             if (data) setDiscussions(data);
             setLoading(false);
        });
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-6 md:p-10 shadow-xl overflow-hidden min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[var(--color-border-subtle)] pb-6">
        <div>
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            Discussions & Issues
          </h3>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
            Ask for help, report bugs, or share your thoughts on {project.title}.
          </p>
        </div>

        {session ? (
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-2 rounded-md bg-[var(--color-background-surface)] border border-[var(--color-border-subtle)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
             <PlusCircle className="w-4 h-4" />
             {showEditor ? "Cancel" : "New Discussion"}
          </button>
        ) : (
          <div className="text-sm text-[var(--color-text-muted)] bg-[var(--color-background-surface)] px-4 py-2 rounded-md border border-[var(--color-border-subtle)]">
            Sign in to join the discussion
          </div>
        )}
      </div>

      {showEditor && (
         <CreateDiscussion projectSlug={project.slug} onSuccess={handleSuccess} />
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : discussions.length > 0 ? (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] hover:bg-[var(--color-background-base)] rounded-xl overflow-hidden shadow-sm transition-colors cursor-pointer group">
              <div className="p-5 flex gap-4">
                 <div className="mt-1">
                   {discussion.status === 'open' ? (
                      <CircleDot className="w-5 h-5 text-[var(--color-brand)]" />
                   ) : (
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-blue-400 transition-colors">{discussion.title}</h4>
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
                       {discussion.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1.5 font-medium text-[var(--color-text-secondary)]">
                        {discussion.profiles?.avatar_url ? (
                            <img src={discussion.profiles.avatar_url} alt="author" className="w-4 h-4 rounded-full" />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                        {discussion.profiles?.username || discussion.profiles?.full_name || 'Anonymous User'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        opened on {new Date(discussion.created_at).toLocaleDateString()}
                      </span>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20">
           <MessageSquare className="w-16 h-16 text-[var(--color-border-subtle)] mb-6" />
           <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">No discussions started.</p>
           <p className="text-[var(--color-text-muted)] text-sm max-w-sm">Have a question about {project.title}? Be the first to ask!</p>
        </div>
      )}
    </div>
  );
}
