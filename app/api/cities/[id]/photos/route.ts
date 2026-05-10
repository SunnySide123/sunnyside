import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await getSupabase()
    .from('city_photos')
    .select('*')
    .eq('city_id', params.id)
    .order('date', { ascending: false })

  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { data: photo, error } = await getSupabase()
    .from('city_photos')
    .insert({
      city_id: params.id,
      image_url: body.image_url,
      date: body.date,
      note: body.note || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(photo)
}
