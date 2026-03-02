"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  loaders: { name: string }[];
  versions: { version: string }[];
}

export function FilterPanel({ loaders, versions }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "relevance";
  const currentLoader = searchParams.get("loader") || "";
  const currentVersion = searchParams.get("version") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
    });
  };

  const sortOptions = [
    { value: "relevance", label: "Trending" },
    { value: "downloads", label: "Most Downloaded" },
    { value: "follows", label: "Most Followed" },
    { value: "newest", label: "Recently Added" },
    { value: "updated", label: "Recently Updated" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-lg md:flex-row md:items-center md:justify-between sticky top-20 z-40">
      <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold">
        <SlidersHorizontal className="h-5 w-5 text-[var(--color-brand)]" />
        Filters
        {isPending && <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
           <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider hidden sm:block">Sort By</label>
           <select
            value={currentSort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-2 pl-3 pr-8 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all appearance-none cursor-pointer hover:border-[var(--color-text-muted)]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
           <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider hidden sm:block">Loader</label>
           <select
            value={currentLoader}
            onChange={(e) => handleFilterChange("loader", e.target.value)}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-2 pl-3 pr-8 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all appearance-none cursor-pointer hover:border-[var(--color-text-muted)]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
          >
            <option value="">Any Loader</option>
            {loaders.map((loader) => (
              <option key={loader.name} value={loader.name} className="capitalize">{loader.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
           <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider hidden sm:block">Version</label>
           <select
            value={currentVersion}
            onChange={(e) => handleFilterChange("version", e.target.value)}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-2 pl-3 pr-8 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all appearance-none cursor-pointer hover:border-[var(--color-text-muted)]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
          >
            <option value="">Any Version</option>
            {versions.slice(0, 30).map((v) => (
              <option key={v.version} value={v.version}>{v.version}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
