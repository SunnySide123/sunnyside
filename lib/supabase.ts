import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(
    process.env.SUPABASE_URL || 'https://lmvazzuggqdpelcucxhw.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || ''
  )
  return _client
}
