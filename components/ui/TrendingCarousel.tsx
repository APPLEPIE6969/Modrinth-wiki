"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SearchResultProject } from "@/types/modrinth";
import { Flame, ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";

export function TrendingCarousel({ projects }: { projects: SearchResultProject[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full mb-12">
      <FadeIn direction="none" delay={0.2} duration={0.8}>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Trending This Week</h2>
        </div>
      </FadeIn>

      <FadeIn direction="right" delay={0.3} duration={0.8}>
        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-thin snap-x snap-mandatory">
          {projects.map((project, idx) => (
            <motion.div
              key={project.project_id}
              whileHover={{ y: -4 }}
              className="group relative flex-none w-72 shrink-0 snap-start overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-gradient-to-b from-[var(--color-background-card)] to-[var(--color-background-surface)] p-5 shadow-lg transition-colors hover:border-orange-500/50"
            >
              <Link href={`/project/${project.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {project.title}</span>
              </Link>

              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--color-background-base)] border border-[var(--color-border-subtle)]">
                  {project.icon_url ? (
                    <img src={project.icon_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-[var(--color-text-muted)]">
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white truncate max-w-[180px] group-hover:text-orange-400 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    {project.project_type}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4 h-10">
                {project.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-primary)]">
                  <span className="text-orange-500">#{idx + 1}</span> Trending
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-orange-500 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
