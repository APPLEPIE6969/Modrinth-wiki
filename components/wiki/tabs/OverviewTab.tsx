import { Suspense } from "react";
import { MarkdownRenderer } from "@/components/wiki/MarkdownRenderer";
import { Gallery } from "@/components/wiki/Gallery";
import { VersionCompatibility } from "@/components/wiki/VersionCompatibility";
import { Project } from "@/types/modrinth";

interface OverviewTabProps {
  project: Project;
}

export function OverviewTab({ project }: OverviewTabProps) {
  return (
    <>
      <VersionCompatibility project={project} />

      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-6 md:p-10 shadow-xl overflow-hidden mb-12">
        {project.body ? (
          <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--color-background-surface)] rounded-xl" />}>
            <MarkdownRenderer content={project.body} />
          </Suspense>
        ) : (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            No description provided for this project.
          </div>
        )}
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <Gallery gallery={project.gallery} />
      )}
    </>
  );
}
