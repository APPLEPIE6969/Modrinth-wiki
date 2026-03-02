"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FavoriteButtonProps {
  projectSlug: string;
  initialFavorited: boolean;
}

export function FavoriteButton({ projectSlug, initialFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    // Optimistic update
    setIsFavorited(!isFavorited);

    const result = await toggleFavorite(projectSlug);

    if (result.error) {
      // Revert if error
      setIsFavorited(isFavorited);
      alert(result.error);
    }

    setIsLoading(false);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all",
        isFavorited
          ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
          : "bg-[var(--color-background-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:text-white hover:border-[var(--color-text-muted)]"
      )}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Star className={cn("h-5 w-5", isFavorited ? "fill-yellow-500" : "")} />
      <span className="hidden sm:inline">{isFavorited ? "Saved" : "Save"}</span>
    </motion.button>
  );
}
