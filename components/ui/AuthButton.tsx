"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogIn, LogOut, Github, User as UserIcon } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export function AuthButton() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-[var(--color-background-surface)]"></div>;
  }

  return session ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 overflow-hidden max-w-[150px]">
        {session.user.user_metadata?.avatar_url ? (
          <img
            src={session.user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-[var(--color-border-subtle)]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--color-background-surface)] flex items-center justify-center border border-[var(--color-border-subtle)]">
            <UserIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
        )}
        <span className="text-sm font-medium text-[var(--color-text-primary)] truncate hidden md:block">
          {session.user.user_metadata?.preferred_username || session.user.email?.split('@')[0]}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-white transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  ) : (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 rounded-md bg-[#24292e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f363d] focus:outline-none focus:ring-2 focus:ring-[#24292e] focus:ring-offset-2 focus:ring-offset-[var(--color-background-base)] transition-colors"
    >
      <Github className="h-4 w-4" />
      Sign In
    </button>
  );
}
