"use client";

import { createClient } from "@/lib/supabase/client";
import { Github, AlertCircle, Mail, Lock, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

export default function SignUpPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const isMissingEnv = process.env.NEXT_PUBLIC_SUPABASE_URL === undefined || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("localhost:54321");

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    if (isMissingEnv) return;
    setLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMissingEnv) return;

    if (!email || !password || !username) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading('email');
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          preferred_username: username,
          full_name: username
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }
    setLoading(null);
  };

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center py-12">
      <FadeIn direction="up" duration={0.6}>
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] shadow-2xl">
          <div className="flex flex-col items-center border-b border-[var(--color-border-subtle)] p-8 text-center bg-[var(--color-background-surface)]">
            <Link href="/" className="mb-6 flex items-center justify-center rounded-full bg-[var(--color-background-base)] p-4 shadow-inner border border-[var(--color-border-subtle)] hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Modrinth Wiki Logo" className="h-12 w-auto drop-shadow-lg" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create an Account</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Join the community to post guides and discuss your favorite mods.
            </p>
          </div>

          <div className="px-8 pt-6 pb-2">
            {isMissingEnv ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-red-500/10 p-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Database Not Configured</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Authentication requires <code className="text-[var(--color-text-primary)] bg-[var(--color-background-base)] px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> to be set.
                  </p>
                </div>
                <Link href="/" className="mt-4 text-sm font-medium text-[var(--color-brand)]">Return to Home</Link>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center gap-4 text-center py-4 mb-6">
                <div className="rounded-full bg-[var(--color-brand)]/10 p-4">
                  <Mail className="h-8 w-8 text-[var(--color-brand)]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    We sent a verification link to <span className="font-semibold text-white">{email}</span>. Please verify your email to continue.
                  </p>
                </div>
                <Link href="/login" className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors">
                  Return to login <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-md flex items-center gap-2 text-sm mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="jules_coder"
                        className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-border-subtle)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-border-subtle)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-border-subtle)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading !== null}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-[#111] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-card)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-[var(--color-brand)]/20"
                  >
                    {loading === 'email' ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#111] border-t-transparent" /> : "Create Account"}
                  </button>
                </form>

                <div className="relative flex items-center py-2 mb-2">
                  <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-widest">Or continue with</span>
                  <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading !== null}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-50 border border-gray-200"
                  >
                    {loading === 'google' ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" /> : <><GoogleIcon /> Google</>}
                  </button>

                  <button
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={loading !== null}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#24292e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2f363d] focus:outline-none focus:ring-2 focus:ring-[#24292e] transition-all disabled:opacity-50"
                  >
                    {loading === 'github' ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Github className="h-4 w-4" /> GitHub</>}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-background-base)] p-5 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[var(--color-brand)] hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
