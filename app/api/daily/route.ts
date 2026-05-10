import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days = searchParams.get('days')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabase.from('daily_photos').select('*').order('date', { ascending: false })

  if (days) {
    const since = new Date()
    since.setDate(since.getDate() - parseInt(days))
    query = query.gte('date', since.toISOString().split('T')[0])
  }
  if (from) query = query.gte('date', from)
  if (to) query = query.lte('date', to)

  const { data } = await query
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data: photo, error } = await supabase
    .from('daily_photos')
    .insert({
      image_url: body.image_url,
      date: body.date,
      city: body.city || '',
      note: body.note || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(photo)
}
