import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a given href is safe to render in an <a> tag.
 * Allows only absolute URLs starting with http/https, relative paths,
 * or known-safe protocols like mailto: and tel:.
 * Blocks dangerous protocols like javascript:, data:, and vbscript:.
 */
export function isValidHref(href?: string): boolean {
  if (!href) return false;

  // Browsers ignore leading/trailing whitespace and control characters in hrefs
  const normalizedHref = href.trim().toLowerCase();

  // Basic absolute URL check (http/https)
  if (normalizedHref.startsWith('http://') || normalizedHref.startsWith('https://')) return true;

  // Common safe protocols for communication
  if (normalizedHref.startsWith('mailto:') || normalizedHref.startsWith('tel:')) return true;

  // Basic relative path check (starts with /, ./, ../, or #)
  if (/^(\/|\.\.?\/|#)/.test(normalizedHref)) return true;

  // Check for presence of any protocol:
  // We check if it looks like a protocol (alpha followed by alphanumeric/+/./- and a colon)
  // but exclude known safe ones.
  const protocolMatch = normalizedHref.match(/^[a-z][a-z0-9+.-]*:/);
  if (protocolMatch) {
    // Already allowed http/https/mailto/tel above, so if we're here, it's an unrecognized protocol.
    return false;
  }

  // Handle other relative paths (not containing protocols)
  return true;
}
