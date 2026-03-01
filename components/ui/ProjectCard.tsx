"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchResultProject } from "@/types/modrinth";
import { Download, Monitor, Server } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: SearchResultProject;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-5 transition-all hover:border-[var(--color-brand)] hover:shadow-[0_0_15px_rgba(0,175,92,0.15)] h-full min-h-[260px]"
    >
      <Link href={`/project/${project.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View project {project.title}</span>
      </Link>

      <div className="flex-1">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-background-surface)]">
            {project.icon_url ? (
              <img
                src={project.icon_url}
                alt={`${project.title} icon`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--color-text-muted)] bg-[var(--color-border-subtle)]">
                {project.title.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              by <span className="font-medium text-[var(--color-text-primary)]">{project.author}</span>
            </p>
          </div>
        </div>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
          {project.description}
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-primary)]" title="Downloads">
            <Download className="h-4 w-4 text-[var(--color-brand)]" />
            <span>{new Intl.NumberFormat("en-US", { notation: "compact" }).format(project.downloads)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            {project.client_side !== "unsupported" && (
              <div className="flex items-center gap-1" title="Client-side">
                <Monitor className={cn("h-4 w-4", project.client_side === "required" ? "text-[var(--color-brand)]" : "")} />
              </div>
            )}
            {project.server_side !== "unsupported" && (
              <div className="flex items-center gap-1" title="Server-side">
                <Server className={cn("h-4 w-4", project.server_side === "required" ? "text-[var(--color-brand)]" : "")} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-md bg-[var(--color-background-surface)] px-2 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider group-hover:bg-[var(--color-border-subtle)] transition-colors"
            >
              {category}
            </span>
          ))}
          {project.categories.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-[var(--color-background-surface)] px-2 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]">
              +{project.categories.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
