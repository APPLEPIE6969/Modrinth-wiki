import { Project } from "@/types/modrinth";
import { LinkIcon, ShieldCheck, Download, Code2, Users, Monitor, Server, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  project: Project;
}

export function Sidebar({ project }: SidebarProps) {
  const numberFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });

  const metadataItems = [
    { label: "Downloads", value: numberFormatter.format(project.downloads), icon: Download },
    { label: "Followers", value: numberFormatter.format(project.followers), icon: Users },
    { label: "License", value: project.license?.name || "Unknown", icon: ShieldCheck, href: project.license?.url },
  ];

  const environments = [
    { label: "Client", status: project.client_side, icon: Monitor },
    { label: "Server", status: project.server_side, icon: Server },
  ];

  const links = [
    { label: "Source Code", href: project.source_url, icon: Code2 },
    { label: "Issues", href: project.issues_url, icon: AlertCircle },
    { label: "Wiki", href: project.wiki_url, icon: LinkIcon },
    { label: "Discord", href: project.discord_url, icon: MessageSquare },
  ].filter(link => link.href);

  return (
    <aside className="space-y-6 w-full lg:w-80 shrink-0">
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5 space-y-6">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[var(--color-text-muted)]" /> Metadata
          </h3>
          <ul className="space-y-3">
            {metadataItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <item.icon className="w-4 h-4" /> {item.label}
                </span>
                {item.href ? (
                  <Link href={item.href} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors truncate max-w-[140px] text-right">
                    {item.value}
                  </Link>
                ) : (
                  <span className="font-medium text-[var(--color-text-primary)]">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[var(--color-border-subtle)] pt-6">
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Monitor className="w-4 h-4 text-[var(--color-text-muted)]" /> Environment
          </h3>
          <ul className="space-y-3">
            {environments.map((env, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <env.icon className="w-4 h-4" /> {env.label}
                </span>
                <span className={cn(
                  "font-medium px-2 py-1 rounded text-xs uppercase tracking-wider",
                  env.status === 'required' ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)] border border-[var(--color-brand)]/20" :
                  env.status === 'optional' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                  "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {env.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {links.length > 0 && (
          <div className="border-t border-[var(--color-border-subtle)] pt-6">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <LinkIcon className="w-4 h-4 text-[var(--color-text-muted)]" /> External Links
            </h3>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-white group p-2 rounded-lg hover:bg-[var(--color-background-surface)] transition-all"
                  >
                    <link.icon className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5">
         <h3 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
            Categories
         </h3>
         <div className="flex flex-wrap gap-2">
          {project.categories.map((category) => (
            <Link
              key={category}
              href={`/?q=${category}`}
              className="inline-flex items-center rounded-md bg-[var(--color-background-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-white transition-colors capitalize"
            >
              {category}
            </Link>
          ))}
         </div>
      </div>
    </aside>
  );
}
