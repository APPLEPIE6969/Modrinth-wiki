"use client";

import { createClient } from "@/lib/supabase/client";
import { Github, Hexagon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Check if we are using the fallback dummy URL
  const isMissingEnv = process.env.NEXT_PUBLIC_SUPABASE_URL === undefined || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("localhost:54321");

  const handleSignIn = async () => {
    if (isMissingEnv) return;

    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <FadeIn direction="up" duration={0.6}>
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] shadow-2xl">
          <div className="flex flex-col items-center border-b border-[var(--color-border-subtle)] p-8 text-center bg-[var(--color-background-surface)]">
            <Link href="/" className="mb-6 flex items-center justify-center rounded-full bg-[var(--color-background-base)] p-4 shadow-inner border border-[var(--color-border-subtle)]">
              <Hexagon className="h-12 w-12 text-[var(--color-brand)]" fill="currentColor" strokeWidth={1} />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Sign in to contribute to the Modrinth community wiki, post discussions, and vote on helpful guides.
            </p>
          </div>

          <div className="p-8">
            {isMissingEnv ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-red-500/10 p-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Missing Database Configuration</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Authentication is currently disabled because the <code className="text-[var(--color-text-primary)] bg-[var(--color-background-base)] px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> environment variables are not set in the Vercel dashboard.
                  </p>
                </div>
                <Link
                  href="/"
                  className="mt-4 text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292e] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2f363d] focus:outline-none focus:ring-2 focus:ring-[#24292e] focus:ring-offset-2 focus:ring-offset-[var(--color-background-card)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </>
                )}
              </button>
            )}

            {!isMissingEnv && (
              <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
