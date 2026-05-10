import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const province = searchParams.get('province')
  const litOnly = searchParams.get('litOnly')
  const sortBy = searchParams.get('sortBy') || 'date'

  let query = getSupabase().from('cities').select('*')

  if (province) query = query.eq('province', province)
  if (litOnly === 'true') query = query.eq('is_lit', true)

  if (sortBy === 'name') {
    query = query.order('name', { ascending: true })
  } else {
    query = query.order('arrival_date', { ascending: false })
  }

  const { data } = await query
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data: city, error } = await getSupabase()
    .from('cities')
    .insert({
      name: body.name,
      province: body.province,
      arrival_date: body.arrival_date || null,
      is_lit: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(city)
}
