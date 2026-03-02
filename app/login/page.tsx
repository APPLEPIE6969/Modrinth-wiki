"use client";

import { createClient } from "@/lib/supabase/client";
import { Github, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

const GoogleIcon = () => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-5 w-5"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    ></path>
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    ></path>
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    ></path>
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    ></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  // Check if we are using the fallback dummy URL
  const isMissingEnv = process.env.NEXT_PUBLIC_SUPABASE_URL === undefined || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("localhost:54321");

  const handleSignIn = async (provider: 'github' | 'google') => {
    if (isMissingEnv) return;

    setLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider: provider,
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
              <img src="/logo.png" alt="Modrinth Wiki Logo" className="h-16 w-auto drop-shadow-lg" />
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
              <div className="space-y-4">
                <button
                  onClick={() => handleSignIn('google')}
                  disabled={loading !== null}
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-[var(--color-background-card)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                >
                  {loading === 'google' ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                  ) : (
                    <>
                      <GoogleIcon />
                      Continue with Google
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSignIn('github')}
                  disabled={loading !== null}
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292e] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2f363d] focus:outline-none focus:ring-2 focus:ring-[#24292e] focus:ring-offset-2 focus:ring-offset-[var(--color-background-card)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === 'github' ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Github className="h-5 w-5" />
                      Continue with GitHub
                    </>
                  )}
                </button>
              </div>
            )}

            {!isMissingEnv && (
              <p className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
