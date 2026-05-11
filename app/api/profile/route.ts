import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Profile GET error:', error.message)
    }

    return NextResponse.json(
      profile || { id: 'default', avatar_url: null, signature: '' },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: any) {
    console.error('Profile GET exception:', err.message)
    return NextResponse.json(
      { id: 'default', avatar_url: null, signature: '' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    // Fetch existing profile first, then merge
    const supabase = getSupabase()
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle()

    const merged = {
      id: 'default',
      avatar_url: existing?.avatar_url ?? null,
      signature: existing?.signature ?? '',
      updated_at: new Date().toISOString(),
    }
    if (body.avatar_url !== undefined) merged.avatar_url = body.avatar_url
    if (body.signature !== undefined) merged.signature = body.signature

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(merged)
      .select()
      .single()

    if (error) {
      console.error('Profile PUT error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(profile)
  } catch (err: any) {
    console.error('Profile PUT exception:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
