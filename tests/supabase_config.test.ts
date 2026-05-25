import { mock, describe, it, expect, beforeEach, afterEach } from 'bun:test';

// Mock @supabase/ssr before importing the actual client
mock.module('@supabase/ssr', () => ({
  createBrowserClient: (url: string, key: string) => ({ url, key }),
}));

describe('Supabase Client Configuration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clear relevant env vars before each test
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    // Restore relevant env vars after each test
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  describe('isSupabaseConfigured', () => {
    it('should return false when both env vars are missing', async () => {
      const { isSupabaseConfigured } = await import('../lib/supabase/client.ts');
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('should return false when only NEXT_PUBLIC_SUPABASE_URL is present', async () => {
      const { isSupabaseConfigured } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('should return false when only NEXT_PUBLIC_SUPABASE_ANON_KEY is present', async () => {
      const { isSupabaseConfigured } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('should return true when both env vars are present', async () => {
      const { isSupabaseConfigured } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
      expect(isSupabaseConfigured()).toBe(true);
    });

    it('should return false when env vars are empty strings', async () => {
      const { isSupabaseConfigured } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('should return false when one env var is an empty string', async () => {
      const { isSupabaseConfigured } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';
      expect(isSupabaseConfigured()).toBe(false);
    });
  });

  describe('createClient', () => {
    it('should throw error when env vars are missing', async () => {
      const { createClient } = await import('../lib/supabase/client.ts');
      expect(() => createClient()).toThrow(
        'Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing'
      );
    });

    it('should throw error when only NEXT_PUBLIC_SUPABASE_URL is present', async () => {
      const { createClient } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
      expect(() => createClient()).toThrow();
    });

    it('should throw error when only NEXT_PUBLIC_SUPABASE_ANON_KEY is present', async () => {
      const { createClient } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
      expect(() => createClient()).toThrow();
    });

    it('should throw error when env vars are empty strings', async () => {
      const { createClient } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';
      expect(() => createClient()).toThrow();
    });

    it('should not throw when both env vars are present', async () => {
      const { createClient } = await import('../lib/supabase/client.ts');
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
      expect(() => createClient()).not.toThrow();
    });
  });
});
