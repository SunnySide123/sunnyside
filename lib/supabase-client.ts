import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client
  _client = createClient(
    'https://lmvazzuggqdpelcucxhw.supabase.co',
    'sb_publishable_HIH03iYWlc2v6Z_kLIMEkg_2hvt3Dej'
  )
  return _client
}
