import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createClient as createBrowserClient, isSupabaseConfigured } from '../lib/supabase/client.ts';

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

  it('should return false for isSupabaseConfigured when env vars are missing', () => {
    assert.strictEqual(isSupabaseConfigured(), false);
  });

  it('should return true for isSupabaseConfigured when env vars are present', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
    assert.strictEqual(isSupabaseConfigured(), true);
  });

  it('should throw error in createClient when env vars are missing', () => {
    assert.throws(() => createBrowserClient(), {
      message: 'Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing'
    });
  });

  it('should not throw in createClient when env vars are present', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_key';
    assert.doesNotThrow(() => createBrowserClient());
  });
});
