import { createBrowserClient } from '@supabase/ssr'

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    typeof url === 'string' &&
    url.length > 0 &&
    !url.includes('localhost:54321') &&
    typeof anonKey === 'string' &&
    anonKey.length > 0 &&
    anonKey !== 'dummy_anon_key'
  )
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
