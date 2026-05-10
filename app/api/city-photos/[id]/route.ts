import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await supabase.from('city_photos').delete().eq('id', params.id)
  return NextResponse.json({ success: true })
}
