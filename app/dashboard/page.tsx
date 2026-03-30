import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getProject } from "@/lib/api";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { FadeIn, FadeInStaggerGroup } from "@/components/ui/FadeIn";
import { SearchResultProject } from "@/types/modrinth";
import { User, Star, BookOpen, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/wiki/MarkdownRenderer";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch data concurrently for better performance
  const [
    { data: favorites },
    { data: wikiPosts },
    { data: discussions }
  ] = await Promise.all([
    supabase
      .from("user_favorites")
      .select("project_slug")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("wiki_posts")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("discussions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  // Convert project slugs to search result format for the card component
  const favoriteProjects: SearchResultProject[] = favorites && favorites.length > 0
    ? (await Promise.all(
        favorites.map(async (fav) => {
          try {
            const fullProject = await getProject(fav.project_slug);
            return {
              slug: fullProject.slug,
              title: fullProject.title,
              description: fullProject.description,
              categories: fullProject.categories,
              client_side: fullProject.client_side,
              server_side: fullProject.server_side,
              project_type: fullProject.project_type,
              downloads: fullProject.downloads,
              icon_url: fullProject.icon_url,
              project_id: fullProject.id,
              author: fullProject.organization || "Unknown",
              versions: fullProject.versions,
              follows: fullProject.followers,
              date_created: fullProject.published,
              date_modified: fullProject.updated,
              latest_version: fullProject.versions[0] || "",
              license: fullProject.license?.name || "Unknown",
              gallery: fullProject.gallery?.map(g => g.url) || [],
              featured_gallery: null,
            } as SearchResultProject;
          } catch {
            // Skip projects that fail to load
            return null;
          }
        })
      )).filter((res): res is SearchResultProject => res !== null)
    : [];

  const userMeta = session.user.user_metadata;
  const username = userMeta?.preferred_username || userMeta?.full_name || session.user.email?.split('@')[0];

  return (
    <div className="flex flex-col gap-12 pb-20">
      <FadeIn direction="up" duration={0.6}>
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
          <div className="h-24 w-24 shrink-0 rounded-full overflow-hidden border-4 border-[var(--color-background-surface)] bg-[var(--color-background-base)]">
            {userMeta?.avatar_url ? (
              <img src={userMeta.avatar_url} alt={username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--color-background-surface)]">
                <User className="h-12 w-12 text-[var(--color-text-muted)]" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{username}</h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {session.user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 bg-[var(--color-background-surface)] px-4 py-2 rounded-lg border border-[var(--color-border-subtle)]">
                 <Star className="h-4 w-4 text-yellow-500" />
                 <span className="text-sm font-medium text-white">{favorites?.length || 0} Favorites</span>
               </div>
               <div className="flex items-center gap-2 bg-[var(--color-background-surface)] px-4 py-2 rounded-lg border border-[var(--color-border-subtle)]">
                 <BookOpen className="h-4 w-4 text-[var(--color-brand)]" />
                 <span className="text-sm font-medium text-white">{wikiPosts?.length || 0} Wiki Posts</span>
               </div>
               <div className="flex items-center gap-2 bg-[var(--color-background-surface)] px-4 py-2 rounded-lg border border-[var(--color-border-subtle)]">
                 <MessageSquare className="h-4 w-4 text-blue-500" />
                 <span className="text-sm font-medium text-white">{discussions?.length || 0} Discussions</span>
               </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="space-y-6">
        <FadeIn direction="none" delay={0.2}>
          <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border-subtle)] pb-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white">Your Favorites</h2>
          </div>
        </FadeIn>

        {favoriteProjects.length > 0 ? (
          <FadeInStaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProjects.map((project, index) => (
              <ProjectCard key={project.project_id} project={project} index={index} />
            ))}
          </FadeInStaggerGroup>
        ) : (
          <FadeIn direction="up" delay={0.3}>
            <div className="bg-[var(--color-background-card)] border border-[var(--color-border-subtle)] rounded-xl p-12 text-center">
               <p className="text-[var(--color-text-secondary)] mb-4">You haven't favorited any projects yet.</p>
               <Link href="/" className="inline-flex items-center text-[var(--color-brand)] hover:underline">
                 Explore Modrinth
               </Link>
            </div>
          </FadeIn>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <FadeIn direction="none" delay={0.3}>
            <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border-subtle)] pb-4">
              <BookOpen className="h-6 w-6 text-[var(--color-brand)]" />
              <h2 className="text-2xl font-bold text-white">Recent Wiki Posts</h2>
            </div>
          </FadeIn>

          {wikiPosts && wikiPosts.length > 0 ? (
            <FadeInStaggerGroup className="space-y-4">
              {wikiPosts.map((post) => (
                 <div key={post.id} className="border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] rounded-xl p-5 block hover:border-[var(--color-brand)] transition-colors">
                    <Link href={`/project/${post.project_slug}`} className="text-sm text-[var(--color-brand)] font-medium mb-1 block hover:underline">
                      {post.project_slug}
                    </Link>
                    <h3 className="font-bold text-white mb-2 text-lg">{post.title}</h3>
                    <div className="line-clamp-2 text-sm text-[var(--color-text-secondary)] prose-sm">
                       <MarkdownRenderer content={post.content} />
                    </div>
                 </div>
              ))}
            </FadeInStaggerGroup>
          ) : (
            <p className="text-[var(--color-text-muted)] italic">No wiki posts yet.</p>
          )}
        </div>

        <div className="space-y-6">
          <FadeIn direction="none" delay={0.4}>
            <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border-subtle)] pb-4">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-white">Recent Discussions</h2>
            </div>
          </FadeIn>

          {discussions && discussions.length > 0 ? (
            <FadeInStaggerGroup className="space-y-4">
              {discussions.map((discussion) => (
                 <div key={discussion.id} className="border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] rounded-xl p-5 block hover:border-blue-500 transition-colors">
                    <Link href={`/project/${discussion.project_slug}`} className="text-sm text-blue-400 font-medium mb-1 block hover:underline">
                      {discussion.project_slug}
                    </Link>
                    <h3 className="font-bold text-white mb-2 text-lg">{discussion.title}</h3>
                    <div className="line-clamp-2 text-sm text-[var(--color-text-secondary)] prose-sm">
                       {discussion.content}
                    </div>
                 </div>
              ))}
            </FadeInStaggerGroup>
          ) : (
            <p className="text-[var(--color-text-muted)] italic">No discussions started yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
