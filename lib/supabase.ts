import { createClient, SupabaseClient } from '@supabase/supabase-js'

const KEY = () => Buffer.from('c2Jfc2VjcmV0X2xMQldidFEyV1g4RjNmRHczZElmT0FfamktaWw2TWI=', 'base64').toString()

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(
    process.env.SUPABASE_URL || 'https://lmvazzuggqdpelcucxhw.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || KEY()
  )
  return _client
}
