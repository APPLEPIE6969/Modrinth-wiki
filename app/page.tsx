import { Suspense } from "react";
import { searchProjects } from "@/lib/api";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

// Define search params type properly for Next.js App Router
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';

  return (
    <div className="flex flex-col gap-12">
      <section className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-[var(--color-background-surface)] to-[var(--color-background-base)] px-4 py-24 text-center border border-[var(--color-border-subtle)]">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white drop-shadow-sm">
            Discover <span className="text-[var(--color-brand)]">Minecraft</span> Mods
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] sm:text-xl max-w-2xl leading-relaxed">
            The fastest, most beautiful way to explore the Modrinth ecosystem. Search for mods, plugins, and resource packs.
          </p>

          <form action={async (formData) => {
            'use server';
            const query = formData.get('q');
            if (query) {
              redirect(`/?q=${encodeURIComponent(query.toString())}`);
            } else {
              redirect('/');
            }
          }} className="w-full max-w-2xl mt-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-[#00ff84] opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center bg-[var(--color-background-card)] rounded-xl border border-[var(--color-border-subtle)] overflow-hidden shadow-2xl focus-within:ring-2 focus-within:ring-[var(--color-brand)] focus-within:border-transparent transition-all">
                <Search className="absolute left-4 h-6 w-6 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-brand)] transition-colors" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search for sodium, fabric, optimization..."
                  className="w-full bg-transparent py-5 pl-14 pr-4 text-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none h-16 font-medium"
                />
                <button
                  type="submit"
                  className="mr-2 rounded-lg bg-[var(--color-brand)] px-6 py-3 font-semibold text-[#111] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-card)] transition-all h-12 flex items-center shadow-lg shadow-[var(--color-brand)]/20"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            {q ? (
              <>
                Search Results for <span className="text-[var(--color-brand)]">&quot;{q}&quot;</span>
              </>
            ) : (
              <>
                <span className="h-8 w-2 rounded-full bg-[var(--color-brand)] block"></span>
                Trending Projects
              </>
            )}
          </h2>
        </div>

        <Suspense fallback={<ProjectGridSkeleton />}>
          <ProjectList query={q} />
        </Suspense>
      </section>
    </div>
  );
}

async function ProjectList({ query }: { query: string }) {
  const data = await searchProjects(query, 24, 0);

  if (!data.hits || data.hits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border border-[var(--color-border-subtle)] rounded-2xl bg-[var(--color-background-surface)]">
        <Search className="h-16 w-16 text-[var(--color-text-muted)] mb-4" />
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No projects found</h3>
        <p className="text-[var(--color-text-secondary)]">Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.hits.map((project, index) => (
        <ProjectCard key={project.project_id} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[240px] animate-pulse flex-col justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5"
        >
          <div>
            <div className="mb-4 flex items-start gap-4">
              <div className="h-16 w-16 rounded-lg bg-[var(--color-border-subtle)]" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded-md bg-[var(--color-border-subtle)]" />
                <div className="h-3 w-1/2 rounded-md bg-[var(--color-border-subtle)]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded-md bg-[var(--color-border-subtle)]" />
              <div className="h-3 w-5/6 rounded-md bg-[var(--color-border-subtle)]" />
            </div>
          </div>
          <div className="mt-6 flex justify-between gap-2 border-t border-[var(--color-border-subtle)] pt-4">
            <div className="h-4 w-12 rounded-md bg-[var(--color-border-subtle)]" />
            <div className="h-4 w-12 rounded-md bg-[var(--color-border-subtle)]" />
            <div className="h-4 w-12 rounded-md bg-[var(--color-border-subtle)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
