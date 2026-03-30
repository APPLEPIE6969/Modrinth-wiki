import { describe, it, expect } from 'bun:test';

/**
 * Validates if a path is a safe relative path for redirection.
 * It must start with a single '/' and not be followed by another '/' or '\'.
 */
function isValidRelativePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
}

describe('isValidRelativePath', () => {
  it('should return true for valid relative paths', () => {
    expect(isValidRelativePath('/')).toBe(true);
    expect(isValidRelativePath('/dashboard')).toBe(true);
    expect(isValidRelativePath('/settings/profile')).toBe(true);
    expect(isValidRelativePath('/path-with-dashes')).toBe(true);
    expect(isValidRelativePath('/path_with_underscores')).toBe(true);
  });

  it('should return false for paths not starting with /', () => {
    expect(isValidRelativePath('dashboard')).toBe(false);
    expect(isValidRelativePath('https://example.com')).toBe(false);
    expect(isValidRelativePath('http://example.com')).toBe(false);
  });

  it('should return false for protocol-relative paths', () => {
    expect(isValidRelativePath('//example.com')).toBe(false);
  });

  it('should return false for malicious paths using backslash', () => {
    expect(isValidRelativePath('/\\example.com')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidRelativePath('')).toBe(false);
  });
});
