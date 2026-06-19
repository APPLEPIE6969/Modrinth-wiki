import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/ui/FadeIn";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "./ProfileForm";

export default async function SettingsPage(): Promise<JSX.Element> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch the latest profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-3xl mx-auto w-full">
      <FadeIn direction="down" duration={0.4}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-[var(--color-background-surface)] transition-colors text-[var(--color-text-secondary)] hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand)]/20">
              <Settings className="h-5 w-5 text-[var(--color-brand)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Manage your public identity and avatar.</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={0.1} duration={0.6}>
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-6 md:p-10 shadow-xl">
           <ProfileForm
              initialUsername={profile?.username || session.user.user_metadata?.preferred_username || ""}
              initialFullName={profile?.full_name || session.user.user_metadata?.full_name || ""}
              initialAvatarUrl={profile?.avatar_url || session.user.user_metadata?.avatar_url || ""}
              userId={session.user.id}
           />
        </div>
      </FadeIn>
    </div>
  );
}
