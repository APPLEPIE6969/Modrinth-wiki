import { Project } from "@/types/modrinth";
import { CheckCircle2, Cpu } from "lucide-react";

interface VersionCompatibilityProps {
  project: Project;
}

export function VersionCompatibility({ project }: VersionCompatibilityProps) {
  // Sort versions descending (simplistic sort assuming semantic versioning like 1.20.1)
  const sortedVersions = [...project.game_versions].sort((a, b) => {
    return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-6 md:p-8 shadow-xl mb-12">
      <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-border-subtle)] pb-4">
        <Cpu className="h-6 w-6 text-[var(--color-brand)]" />
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Compatibility</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Supported Loaders</h4>
          <div className="flex flex-wrap gap-2">
            {project.loaders.map((loader) => (
              <span key={loader} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-background-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] capitalize">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)]" />
                {loader}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Game Versions</h4>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
            {sortedVersions.map((version) => (
              <span key={version} className="inline-flex items-center rounded-md bg-[var(--color-background-surface)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
                {version}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
