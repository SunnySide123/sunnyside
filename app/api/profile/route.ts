import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  return NextResponse.json(profile || { id: 'default', avatar_url: null, signature: '' })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()

  const updates: Record<string, unknown> = {}
  if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url
  if (body.signature !== undefined) updates.signature = body.signature
  updates.updated_at = new Date().toISOString()

  const { data: profile } = await supabase
    .from('profiles')
    .upsert({ id: 'default', ...updates })
    .select()
    .single()

  return NextResponse.json(profile)
}
