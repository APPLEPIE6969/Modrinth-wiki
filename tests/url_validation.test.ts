import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

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

describe('isValidHref', () => {
  it('should allow valid absolute URLs', () => {
    assert.strictEqual(isValidHref('https://google.com'), true);
    assert.strictEqual(isValidHref('http://example.org'), true);
  });

  it('should allow relative paths', () => {
    assert.strictEqual(isValidHref('/some/path'), true);
    assert.strictEqual(isValidHref('./local/file'), true);
    assert.strictEqual(isValidHref('../parent/file'), true);
    assert.strictEqual(isValidHref('#anchor'), true);
    assert.strictEqual(isValidHref('some-page'), true);
  });

  it('should allow communication protocols', () => {
    assert.strictEqual(isValidHref('mailto:test@example.com'), true);
    assert.strictEqual(isValidHref('tel:+123456789'), true);
  });

  it('should block dangerous protocols', () => {
    assert.strictEqual(isValidHref('javascript:alert(1)'), false);
    assert.strictEqual(isValidHref('data:text/html,<h1>Hacked</h1>'), false);
    assert.strictEqual(isValidHref('vbscript:msgbox("Hi")'), false);
  });

  it('should block bypass attempts with whitespace', () => {
    assert.strictEqual(isValidHref(' javascript:alert(1)'), false);
    assert.strictEqual(isValidHref('\njavascript:alert(1)'), false);
    assert.strictEqual(isValidHref('javascript:alert(1) '), false);
  });

  it('should handle case insensitivity', () => {
    assert.strictEqual(isValidHref('JAVASCRIPT:alert(1)'), false);
    assert.strictEqual(isValidHref('HTTPS://google.com'), true);
  });

  it('should handle empty or undefined input', () => {
    assert.strictEqual(isValidHref(undefined), false);
    assert.strictEqual(isValidHref(''), false);
  });
});
