import Link from "next/link";
import { Hexagon } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-6 md:py-12 mt-12">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Modrinth Wiki Logo" className="h-6 w-auto opacity-50 grayscale" />
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-secondary)]">
              Modrinth<span className="text-[var(--color-text-muted)]">Wiki</span>
            </span>
          </Link>
          <p className="text-center text-sm leading-loose text-[var(--color-text-muted)] md:text-left">
            Built for the community. Not officially affiliated with Modrinth.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://modrinth.com/legal/terms"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            Terms
          </Link>
          <Link
            href="https://modrinth.com/legal/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="https://api.modrinth.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            API
          </Link>
        </div>
      </div>
    </footer>
  );
}
