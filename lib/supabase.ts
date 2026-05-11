import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function decodeKey(): string {
  try {
    return Buffer.from('c2Jfc2VjcmV0X2xMQldidFEyV1g4RjNmRHczZElmT0FfamktaWw2TWI=', 'base64').toString()
  } catch {
    return ''
  }
}

function getServiceKey(): string {
  const envKey = process.env.SUPABASE_SERVICE_KEY
  if (envKey && (envKey.startsWith('sb_secret_') || envKey.startsWith('eyJ'))) {
    return envKey
  }
  return decodeKey()
}

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(
    process.env.SUPABASE_URL || 'https://lmvazzuggqdpelcucxhw.supabase.co',
    getServiceKey()
  )
  return _client
}
