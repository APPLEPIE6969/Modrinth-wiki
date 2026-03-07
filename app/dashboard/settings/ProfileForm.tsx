"use client";

import { useState, useRef } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Loader2, AlertCircle, Upload, CheckCircle2, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialUsername: string;
  initialFullName: string;
  initialAvatarUrl: string;
  userId: string;
}

export function ProfileForm({ initialUsername, initialFullName, initialAvatarUrl }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.append("currentAvatarUrl", avatarUrl);

    try {
      const result = await updateProfile(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        if (result.avatarUrl) {
          setAvatarUrl(result.avatarUrl);
        }
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 text-[var(--color-brand)] px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>Profile updated successfully!</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-[var(--color-border-subtle)] pb-8">
        <div className="relative group">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-[var(--color-background-surface)] bg-[var(--color-background-base)] shadow-lg relative">
            {(avatarPreview || avatarUrl) ? (
              <img
                src={avatarPreview || avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover group-hover:opacity-50 transition-opacity"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-16 w-16 text-[var(--color-text-muted)] group-hover:opacity-50 transition-opacity" />
              </div>
            )}

            <div
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 cursor-pointer transition-opacity"
              onClick={() => fileInputRef.current?.click()}
            >
               <Upload className="w-8 h-8 text-white mb-1" />
               <span className="text-xs font-semibold text-white">Upload</span>
            </div>
          </div>
          <input
            type="file"
            name="avatar"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/gif, image/webp"
            className="hidden"
          />
        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Profile Picture</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-sm">
            Upload a custom avatar. Recommended size is 256x256px. Max file size 5MB.
          </p>
          <button
             type="button"
             onClick={() => fileInputRef.current?.click()}
             className="mt-4 px-4 py-2 rounded-md bg-[var(--color-background-surface)] border border-[var(--color-border-subtle)] text-sm font-medium hover:border-[var(--color-brand)] transition-colors"
          >
             Choose Image
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={initialUsername}
            className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all max-w-md"
            placeholder="jules_coder"
            required
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">This is your unique handle on the wiki.</p>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Nickname / Display Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue={initialFullName}
            className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] transition-all max-w-md"
            placeholder="Jules"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">Your friendly display name shown on your posts.</p>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-[var(--color-border-subtle)]">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-8 py-3 text-sm font-bold text-[#111] shadow-lg shadow-[var(--color-brand)]/20 hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-card)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </form>
  );
}
