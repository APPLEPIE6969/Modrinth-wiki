import { expect, test, describe } from "bun:test";

// Current vulnerable logic
function vulnerableValidateNext(next: string | null): string {
  return next ?? '/';
}

// Desired secure logic
function secureValidateNext(next: string | null): string {
  const fallback = '/';
  if (!next) return fallback;
  if (next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }
  return fallback;
}

describe("Open Redirect Protection", () => {
  const origin = "https://example.com";

  test("vulnerable logic allows open redirect via @ syntax", () => {
    const maliciousNext = "@attacker.com";
    const next = vulnerableValidateNext(maliciousNext);
    const redirectUrl = `${origin}${next}`;
    expect(redirectUrl).toBe("https://example.com@attacker.com");
  });

  test("vulnerable logic allows protocol-relative redirect", () => {
    const maliciousNext = "//attacker.com";
    const next = vulnerableValidateNext(maliciousNext);
    const redirectUrl = `${origin}${next}`;
    expect(redirectUrl).toBe("https://example.com//attacker.com");
    // Note: while this might look okay, browsers might normalize it or it might be misused depending on context.
    // In this specific case, ${origin}${next} becomes https://example.com//attacker.com
  });

  test("secure logic blocks @ syntax", () => {
    const maliciousNext = "@attacker.com";
    const next = secureValidateNext(maliciousNext);
    const redirectUrl = `${origin}${next}`;
    expect(redirectUrl).toBe("https://example.com/");
  });

  test("secure logic blocks protocol-relative redirect", () => {
    const maliciousNext = "//attacker.com";
    const next = secureValidateNext(maliciousNext);
    const redirectUrl = `${origin}${next}`;
    expect(redirectUrl).toBe("https://example.com/");
  });

  test("secure logic allows safe paths", () => {
    expect(secureValidateNext("/dashboard")).toBe("/dashboard");
  });
});
