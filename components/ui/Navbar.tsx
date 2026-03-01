"use client";

import Link from "next/link";
import { AuthButton } from "./AuthButton";
import { Search, Hexagon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-background-base)]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Hexagon className="h-8 w-8 text-[var(--color-brand)]" fill="currentColor" strokeWidth={1} />
          <span className="text-xl font-bold tracking-tight text-white">
            Modrinth<span className="text-[var(--color-brand)]">Wiki</span>
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
          <AuthButton />
          <form
            onSubmit={handleSearch}
            className="relative hidden w-full max-w-sm sm:block"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-2 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all"
              />
            </div>
          </form>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
              Explore
            </Link>
            <Link
              href="https://modrinth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors md:block"
            >
              Main Site
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
