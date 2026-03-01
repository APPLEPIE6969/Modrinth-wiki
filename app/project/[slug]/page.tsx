import { TeamMember } from "@/types/modrinth";
import { Metadata } from "next";
import { getProject, getProjectTeamMembers } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { Sidebar } from "@/components/wiki/Sidebar";
import { Download, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ProjectTabs } from "@/components/wiki/ProjectTabs";
import { FadeIn } from "@/components/ui/FadeIn";

type Params = Promise<{ slug: string }>;

export const revalidate = 3600;

export async function generateMetadata(
  props: { params: Params }
): Promise<Metadata> {
  const params = await props.params;
  try {
    const project = await getProject(params.slug);
    return {
      title: `${project.title} | Modrinth Wiki`,
      description: project.description,
      openGraph: {
        images: project.icon_url ? [project.icon_url] : [],
      },
    };
  } catch {
    return {
      title: "Project Not Found",
    };
  }
}

export default async function ProjectPage(props: { params: Params }) {
  const params = await props.params;
  let project;
  let teamMembers: TeamMember[] = [];

  try {
    project = await getProject(params.slug);

    if (project.slug && project.slug !== params.slug) {
      redirect(`/project/${project.slug}`);
    }

    if (project.team) {
      teamMembers = await getProjectTeamMembers(project.team);
    }
  } catch {
    notFound();
  }

  const numberFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });

  const primaryAuthor = teamMembers.length > 0
    ? teamMembers[0].user.name || teamMembers[0].user.username
    : project.organization || "Unknown Author";

  return (
    <div className="flex flex-col gap-10 pb-20">
      <FadeIn direction="down" duration={0.6}>
        <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand)]/10 to-transparent" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="shrink-0 rounded-2xl overflow-hidden border-4 border-[var(--color-background-surface)] shadow-lg bg-[var(--color-background-base)] h-32 w-32 md:h-40 md:w-40 flex items-center justify-center text-5xl font-bold text-[var(--color-border-subtle)]">
              {project.icon_url ? (
                <img
                  src={project.icon_url}
                  alt={`${project.title} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                project.title.charAt(0)
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    {project.title}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-[var(--color-brand)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)] border border-[var(--color-brand)]/20 shadow-[0_0_10px_rgba(0,175,92,0.1)]">
                    {project.project_type}
                  </span>
                </div>
                <p className="text-lg text-[var(--color-text-secondary)] md:text-xl font-medium max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
                  <span className="text-[var(--color-text-muted)]">by</span>
                  <span className="hover:text-[var(--color-brand)] transition-colors cursor-pointer">{primaryAuthor}</span>
                  {teamMembers.length > 1 && (
                    <span className="text-[var(--color-text-muted)] text-xs ml-1 bg-[var(--color-background-surface)] px-2 py-0.5 rounded-full border border-[var(--color-border-subtle)]">
                      + {teamMembers.length - 1} more
                    </span>
                  )}
                </div>

                <div className="h-1 w-1 rounded-full bg-[var(--color-border-subtle)] hidden sm:block" />

                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] group" title="Total Downloads">
                  <Download className="w-4 h-4 group-hover:text-[var(--color-brand)] transition-colors" />
                  <span className="font-semibold text-[var(--color-text-primary)]">{numberFormatter.format(project.downloads)}</span>
                </div>

                <div className="h-1 w-1 rounded-full bg-[var(--color-border-subtle)] hidden sm:block" />

                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] group" title="Followers">
                  <Users className="w-4 h-4 group-hover:text-[var(--color-brand)] transition-colors" />
                  <span className="font-semibold text-[var(--color-text-primary)]">{numberFormatter.format(project.followers)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 min-w-0 order-2 lg:order-1">
          <FadeIn direction="up" delay={0.2} duration={0.6}>
            <ProjectTabs project={project} />
          </FadeIn>
        </div>

        <div className="order-1 lg:order-2 w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            <FadeIn direction="left" delay={0.4} duration={0.6}>
               <Link
                  href={`https://modrinth.com/project/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center items-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 py-4 font-bold text-[#111] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-base)] transition-all shadow-lg shadow-[var(--color-brand)]/20"
               >
                  Download on Modrinth <ExternalLink className="w-5 h-5" />
               </Link>
            </FadeIn>
            <FadeIn direction="left" delay={0.5} duration={0.6}>
               <Sidebar project={project} />
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
