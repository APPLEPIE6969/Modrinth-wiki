"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Project } from "@/types/modrinth";
import { cn } from "@/lib/utils";

interface GalleryProps {
  gallery: Project["gallery"];
}

export function Gallery({ gallery }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!gallery || gallery.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-4">
        <ImageIcon className="h-5 w-5 text-[var(--color-brand)]" />
        <h2 className="text-2xl font-bold tracking-tight text-white">Gallery</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {gallery.map((image, index) => (
          <motion.div
            key={image.url}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLightbox(index)}
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] shadow-md transition-all hover:border-[var(--color-brand)] hover:shadow-lg"
          >
            <img
              src={image.url}
              alt={image.title || "Gallery Image"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {image.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="truncate text-xs font-medium text-white">{image.title}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-[110] rounded-full bg-white/10 p-2 text-white hover:bg-[var(--color-brand)] transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-[var(--color-brand)] transition-all sm:left-8"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-[var(--color-brand)] transition-all sm:right-8"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            <div className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-lg shadow-2xl">
              <img
                src={gallery[currentIndex].url}
                alt={gallery[currentIndex].title || "Gallery Fullscreen"}
                className="max-h-[85vh] w-auto max-w-full object-contain"
              />
              {gallery[currentIndex].description && (
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-4 backdrop-blur-md">
                  <p className="text-center text-sm text-white">{gallery[currentIndex].description}</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    index === currentIndex ? "bg-[var(--color-brand)] w-6" : "bg-white/50 hover:bg-white"
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
